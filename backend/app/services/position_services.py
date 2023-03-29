from app.models import position_model, user_model
from app.models.position_model import db
from app.services import user_services

VALID_ORDER_TYPES = ['BUY', 'SELL']


def validate_order_type(order_type: str):
    return order_type in VALID_ORDER_TYPES


def execute_order(
        username: str,
        order_type: str,
        ticker: str,
        quantity: int,
) -> position_model.Position:
    # get user
    user = user_services.get_user_by_username(username)

    if order_type == 'BUY':
        return execute_buy_order(
            user, ticker, quantity
        )
    elif order_type == 'SELL':
        return execute_sell_order(
            user, ticker, quantity
        )


def execute_sell_order(
        user: user_model.User,
        ticker: str,
        quantity: int
) -> position_model.Position:
    # TODO use yfinance to calculate sell price
    sell_price = quantity * 100

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

        user.balance += sell_price
        db.session.add(user)

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    db.session.refresh(user)
    return {
        'ticker': position.ticker,
        'updated_position_quantity': position.quantity,
        'updated_user_balance': user.balance,
    }


def execute_buy_order(
        user: user_model.User,
        ticker: str,
        quantity: int,
):
    """Execute the order of order_type with quantity quantity for the provided ticker. Afterwards, return the position after the trade.
    """
    # TODO use yfinance to calculate buy price
    buy_price = quantity * 100

    if user.balance < buy_price:
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

    user.balance -= buy_price
    db.session.add(user)

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    db.session.refresh(user)
    return {
        'ticker': position.ticker,
        'updated_position_quantity': position.quantity,
        'updated_user_balance': user.balance,
    }


def get_position_by_ticker(ticker: str) -> position_model.Position:
    found_position = position_model.db.session.query(
        position_model.Position
    ).filter(
        position_model.Position.ticker == ticker
    ).first()
    return found_position
