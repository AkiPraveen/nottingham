from flask import Blueprint
from flask_cors import CORS

home_blueprint = Blueprint('home', __name__, )


@home_blueprint.route('/')
def home():
    return 'OK', 200
