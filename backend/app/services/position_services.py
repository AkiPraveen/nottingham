from app.models import position_model, user_model
from app.models.position_model import db
from app.services import user_services
import yfinance as yf

VALID_ORDER_TYPES = ['BUY', 'SELL']


def get_user_positions(username: str):
    user = user_services.get_user_by_username(username)
    positions = position_model.db.session.query(
        position_model.Position
    ).filter(
        position_model.Position.user_id == user.id
    ).all()
    # return dict with ticker as key and holding as value
    return {position.ticker: position.quantity for position in positions}


def get_stock_price_usd_cents(ticker: str):
    """
    Get ticker history and return the last closing price. I am using the 1m interval and history
    so that this will match up with the graph data. (I found that using info['regularMarketPrice']
    was not always accurate, and sometimes returned a price that was not on the graph)

    the value will be returned in USD cents, as that's what is stored in the db

    References:
        https://stackoverflow.com/questions/61104362/how-to-get-actual-stock-prices-with-yfinance
        https://algotrading101.com/learn/yfinance-guide/
    """
    ticker_obj = yf.Ticker(ticker)
    ticker_history = yf.Ticker(ticker).history(interval="1m", period="1d")

    # If we cannot find valid history for this ticker, it must not exist
    if ticker_history['Close'].empty:
        raise Exception('Invalid ticker')

    # return in USD cents
    return int(ticker_history['Close'][-1] * 100)


def ticker_info(ticker: str):
    ticker = yf.Ticker(ticker)
    return ticker.info


def validate_order_type(order_type: str):
    return order_type in VALID_ORDER_TYPES


def execute_order(
        username: str,
        order_type: str,
        ticker: str,
        quantity: int,
):
    # get user
    user = user_services.get_user_by_username(username)

    # calculate_price
    price_usd_cents = get_stock_price_usd_cents(ticker)

    if not price_usd_cents:
        raise Exception(f'Invalid ticker {ticker}')

    if order_type == 'BUY':
        return execute_buy_order(
            user=user,
            price_usd_cents=price_usd_cents,
            ticker=ticker,
            quantity=quantity
        )
    elif order_type == 'SELL':
        return execute_sell_order(
            user=user,
            price_usd_cents=price_usd_cents,
            ticker=ticker,
            quantity=quantity
        )


def execute_sell_order(
        user: user_model.User,
        price_usd_cents: float,
        ticker: str,
        quantity: int
):
    sell_price = quantity * price_usd_cents

    position = get_position_by_ticker(ticker)
    if not position:
        raise Exception(f'No position found for ticker {ticker}, cannot sell')
    if position:
        current_quantity = position.quantity
        new_quantity = current_quantity - quantity
        if new_quantity < 0:
            raise Exception('Not enough shares to sell')
        position.quantity = new_quantity
        db.session.add(position)

        user.balance_usd_cents += sell_price
        db.session.add(user)

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    db.session.refresh(user)
    return {
        'ticker': position.ticker,
        'price_per_share_usd_cents': price_usd_cents,
        'updated_position_quantity': position.quantity,
        'updated_user_balance_usd_cents': user.balance_usd_cents,
    }


def execute_buy_order(
        user: user_model.User,
        price_usd_cents: float,
        ticker: str,
        quantity: int,
):
    """Execute the order of order_type with quantity quantity for the provided ticker. Afterwards, return the position after the trade.
    """
    buy_price = quantity * price_usd_cents

    if user.balance_usd_cents < buy_price:
        raise Exception('Not enough balance to buy')

    position = get_position_by_ticker(ticker)
    if not position:
        # Create the position object w/ quantity
        position = position_model.Position(
            ticker=ticker,
            quantity=quantity,
            user_id=user.id
        )
        db.session.add(position)

    else:
        current_quantity = position.quantity
        new_quantity = current_quantity + quantity
        position.quantity = new_quantity
        db.session.add(position)

    user.balance_usd_cents -= buy_price
    db.session.add(user)

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    db.session.refresh(user)
    return {
        'ticker': position.ticker,
        'price_per_share_usd_cents': price_usd_cents,
        'updated_position_quantity': position.quantity,
        'updated_user_balance_usd_cents': user.balance_usd_cents,
    }


def get_position_by_ticker(ticker: str) -> position_model.Position:
    found_position = position_model.db.session.query(
        position_model.Position
    ).filter(
        position_model.Position.ticker == ticker
    ).first()
    return found_position
