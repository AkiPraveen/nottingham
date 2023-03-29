import os, hashlib, jwt

from app import db
from app.models.user_model import User
from app.token_required import JWT_ALGORITHM

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')


def add_balance_usd_cents(username: str, balance_usd_cents: int) -> int:
    user = get_user_by_username(username)
    user.balance_usd_cents += balance_usd_cents
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    return user.balance_usd_cents


def get_user_by_username(username: str) -> User:
    return User.query.filter(User.username == username).first()


def create_user(username: str, password: str) -> User:
    user = User(username=username)
    set_password(user, password)
    db.session.add(user)
    db.session.commit()


def login(username: str, password: str) -> str:
    if verify_user(username, password):
        return create_jwt_auth_token(username)
    else:
        raise Exception('Invalid username or password')


def verify_user(username: str, password: str) -> bool:
    print('verifying user')
    user = get_user_by_username(username)
    print(f'user found {user}')
    if not user or not check_password(user, password):
        return False
    else:
        return True


def create_jwt_auth_token(username: str) -> str:
    """
    Use username & the JWT secret key stored as an env var to create a JWT token
    that will be used to verify this user's identity for the rest of their operations

    :param username:
    :return str:
    """
    jwt_payload = {
        "sub": username,
    }

    print(f'jwt_payload: {jwt_payload}')
    print(f'secret key: {JWT_SECRET_KEY}')

    jwt_token = jwt.encode(
        payload=jwt_payload,
        key=JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )
    return jwt_token


def set_password(user: User, password: str):
    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    user.password = password_hash


def check_password(user: User, password: str) -> bool:
    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return password_hash == user.password
