import os
from functools import wraps
from flask import abort, request
import jwt

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
JWT_ALGORITHM = 'HS256'


def authorize(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        if not 'Authorization' in request.headers:
            abort(401)

        data = request.headers['Authorization']
        token = str.replace(str(data), 'Bearer ', '')
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            username = payload.get('sub')
        except Exception as e:
            print(f'Authentication failed: {e}')
            abort(401)

        return f(username, *args, **kws)

    return decorated_function
