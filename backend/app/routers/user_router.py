from flask import Blueprint, request

from app.services import user_services
from app.token_required import authorize

user_blueprint = Blueprint('user', __name__)


@user_blueprint.route('/add_balance_usd_cents', methods=['POST'])
@authorize
def add_cash(username: str):
    request_json = request.json

    # Request body validation
    balance_usd_cents = request_json.get('balance_usd_cents', None)
    if not balance_usd_cents:
        return {'message': 'Include balance adj amount'}, 400
    try:
        balance_usd_cents = int(balance_usd_cents)
    except Exception as e:
        return {'message': 'Invalid money (int required)'}, 400

    # Add cash
    updated_balance_usd_cents = user_services.add_balance_usd_cents(username, balance_usd_cents)

    resp = {
        'updated_balance_usd_cents': updated_balance_usd_cents
    }

    return resp, 200


@user_blueprint.route('/register', methods=['POST'])
def register():
    request_json = request.json

    # Request body validation
    username = request_json.get('username', None)
    if not username:
        return 'Provide a username', 400

    password = request_json.get('password', None)
    if not password:
        return 'Provide a password', 400

    # Create user
    try:
        user = user_services.create_user(username, password)
    except Exception as e:
        return {'message': str(e)}, 400

    # after successful registration, login and return token
    token = user_services.login(username, password)
    resp = {
        'auth-token': token
    }

    return resp, 200


@user_blueprint.route('/login', methods=['POST'])
def login():
    request_json = request.json

    # Request body validation
    username = request_json.get('username', None)
    if not username:
        return 'Provide a username', 400

    password = request_json.get('password', None)
    if not password:
        return 'Provide a password', 400

    # Login user
    try:
        token = user_services.login(username, password)
    except Exception as e:
        return {'message': str(e)}, 400

    resp = {
        'auth-token': token
    }

    return resp, 200
