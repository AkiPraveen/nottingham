from flask import Blueprint, request

from app.services import user_services
from app.token_required import authorize

user_blueprint = Blueprint('user', __name__)


@user_blueprint.route('/add_cash', methods=['POST'])
@authorize
def add_cash(username: str):
    request_json = request.json

    # Request body validation
    cash = request_json.get('cash', None)
    if not cash:
        return 'Provide cash', 400
    try:
        cash_int = int(cash)
    except Exception as e:
        return 'Invalid cash (integer required)', 400

    # Add cash
    updated_cash = user_services.add_cash(username, cash_int)

    resp = {
        'updated_cash': updated_cash
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
    user = user_services.create_user(username, password)

    return 'OK', 200


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
    token = user_services.login(username, password)

    resp = {
        'auth-token': token
    }

    return resp, 200
