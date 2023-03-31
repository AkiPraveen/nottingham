from flask import Blueprint
from flask_cors import CORS

home_blueprint = Blueprint('home', __name__, )

cors = CORS(home_blueprint, resources={r"/": {"origins": ["https://nottingham.onrender.com", "http://localhost:3000"]}})


@home_blueprint.route('/')
def home():
    return 'OK', 200
