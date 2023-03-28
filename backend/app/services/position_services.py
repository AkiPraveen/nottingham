from app.models import position_model
from app.models.position_model import db

VALID_ORDER_TYPES = ['BUY', 'SELL']


def validate_order_type(order_type: str):
    return order_type in VALID_ORDER_TYPES


def execute_order(
        order_type: str,
        ticker: str,
        quantity: int,
) -> position_model.Position:
    if order_type == 'BUY':
        return execute_buy_order(
            ticker, quantity
        )
    elif order_type == 'SELL':
        return execute_sell_order(
            ticker, quantity
        )


def execute_sell_order(
        ticker: str,
        quantity: int
) -> position_model.Position:
    # TODO use yfinance to calculate sell price
    sell_price = 100

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

        # TODO add sell_price to user cash
        # TODO session.add the updated user cash

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    return position


def execute_buy_order(
        ticker: str,
        quantity: int,
) -> position_model.Position:
    """Execute the order of order_type with quantity quantity for the provided ticker. Afterwards, return the position after the trade.
    """
    # TODO use yfinance to calculate buy price
    buy_price = 100

    position = get_position_by_ticker(ticker)
    if not position:
        # Create the position object w/ quantity
        position = position_model.Position(
            ticker=ticker,
            quantity=quantity
        )
        db.session.add(position)

        # TODO subtract buy_price from user cash
        # TODO session.add the updated user cash

    else:
        current_quantity = position.quantity
        new_quantity = current_quantity + quantity
        position.quantity = new_quantity
        db.session.add(position)

        # TODO subtract buy_price from user cash
        # TODO session.add the updated user cash

    # commit only if the operations as a whole were successful (to keep them atomic)
    db.session.commit()
    db.session.refresh(position)
    return position


def get_position_by_ticker(ticker: str) -> position_model.Position:
    found_position = position_model.db.session.query(
        position_model.Position
    ).filter(
        position_model.Position.ticker == ticker
    ).first()
    return found_position
