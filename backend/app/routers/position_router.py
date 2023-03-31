from flask import Blueprint, request, jsonify

from app.services import position_services
from app.token_required import authorize

position_blueprint = Blueprint('position', __name__)


### INFORMATION FOR OWNED TICKERS


@position_blueprint.route('/', methods=['GET'])
@authorize
def owned_tickers_summary(username: str):
    """Aggregate data being displayed in the subsequent three endpoints, for one batched request"""
    user_tickers = [
        k for k in position_services.get_user_positions(username)
    ]

    position_quantities = position_services.get_user_positions(username)
    position_market_prices = position_services.get_market_prices(user_tickers)
    position_histories = {
        ticker: position_services.get_stock_price_history_usd_cents(ticker, '3mo', '1d') for ticker in user_tickers
    }

    result = {}
    for ticker in user_tickers:
        result[ticker] = {
            'quantity': position_quantities[ticker],
            'market_price_usd_cents': position_market_prices[ticker],
            'history_usd_cents': position_histories[ticker],
        }

    return jsonify(result), 200


@position_blueprint.route('/quantity', methods=['GET'])
@authorize
def owned_tickers_quantity(username: str):
    user_positions = position_services.get_user_positions(username)
    return {'owned_positions': user_positions}, 200


@position_blueprint.route('/history', methods=['GET'])
@authorize
def owned_tickers_history(username: str):
    user_tickers = [k for k in position_services.get_user_positions(username)]

    history = {
        ticker: position_services.get_stock_price_history_usd_cents(ticker, '3mo', '1d') for ticker in user_tickers
    }
    return {'history': history}, 200


@position_blueprint.route('/market-prices', methods=['GET'])
@authorize
def owned_tickers_market_prices(username: str):
    user_tickers = [
        k for k in position_services.get_user_positions(username)
    ]
    prices = position_services.get_market_prices(
        user_tickers
    )
    return {'prices': prices}, 200


### INFORMATION FOR SINGLE TICKER

@position_blueprint.route('/<ticker>/market-price', methods=['GET'])
@authorize
def single_ticker_market_price(username: str, ticker: str):
    market_price = position_services.get_stock_price_usd_cents(ticker)
    return {'market_price': market_price}, 200


@position_blueprint.route('/<ticker>/research', methods=['GET'])
@authorize
def single_ticker_research(username: str, ticker: str):
    print(ticker)
    research = position_services.get_research_by_ticker(ticker=ticker)
    return {'research': research}, 200


@position_blueprint.route('/<ticker>/history', methods=['GET'])
@authorize
def single_ticker_history(username: str, ticker: str):
    history = position_services.get_stock_price_history_usd_cents(ticker, '3mo', '1d')
    return {'history': history}, 200


@position_blueprint.route('/<ticker>', methods=['GET'])
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


### ORDERS

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
    try:
        order_summary = position_services.execute_order(
            username=username,
            order_type=order_type,
            ticker=ticker,
            quantity=quantity_int
        )
    except Exception as e:
        return {'message': f'Order failed: {e}'}, 400

    # return a dict detailing the order summary
    return order_summary, 200
