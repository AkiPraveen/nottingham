from flask import Blueprint, request

from app.services import user_services

user_blueprint = Blueprint('user', __name__)


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
