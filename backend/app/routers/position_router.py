from flask import Blueprint, request

from app.services import position_services
from app.token_required import authorize

position_blueprint = Blueprint('position', __name__)


@position_blueprint.route('/', methods=['GET'])
@authorize
def get_positions(username: str):
    user_positions = position_services.get_user_positions(username)
    return {'owned_positions': user_positions}, 200


@position_blueprint.route('/<ticker>/owned', methods=['GET'])
@authorize
def get_position(username: str, ticker: str):
    position = position_services.get_position_by_ticker(ticker)
    if not position:
        return 'Position not found', 404
    data = {
        'ticker': position.ticker,
        'quantity': position.quantity
    }
    return data, 200


@position_blueprint.route('/order', methods=['POST'])
@authorize
def order(username: str):
    request_json = request.json

    # Request body validation
    ticker = request_json.get('ticker', None)
    if not ticker:
        return 'Provide a valid ticker', 400

    quantity = request_json.get('quantity', None)
    if not quantity:
        return 'Provide a quantity', 400
    try:
        quantity_int = int(quantity)
    except Exception as e:
        return 'Invalid quantity (integer required)', 400

    order_type = request_json.get('order_type', None)
    if not position_services.validate_order_type(order_type):
        return 'Invalid order type (use BUY or SELL)', 400

    # execute buy/sell order
    order_summary = position_services.execute_order(
        username=username,
        order_type=order_type,
        ticker=ticker,
        quantity=quantity_int
    )

    # return a dict detailing the order summary
    return order_summary, 200
