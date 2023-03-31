import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

DATABASE_URL = os.environ.get('DATABASE_URL', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', '')


def create_app(test_config=None):
    # create flask app
    app = Flask(__name__)

    cors = CORS(app, resources={r"/": {"origins": ["https://nottingham.onrender.com", "http://localhost:3000"]}})

    # Connect to local database at 5432, username & password are postgres, db name is nottingham
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    db.init_app(app)
    Migrate(app, db)

    from app.models.user_model import User
    from app.models.position_model import Position

    # Register blueprints
    from app.routers.user_router import user_blueprint
    from app.routers.position_router import position_blueprint
    from app.routers.home_router import home_blueprint

    app.register_blueprint(home_blueprint)
    app.register_blueprint(user_blueprint, url_prefix='/users')
    app.register_blueprint(position_blueprint, url_prefix='/positions')

    @app.after_request
    def add_header(response):
        print('ADDING AFTER REQUEST')
        response.headers['Access-Control-Allow-Origin'] = FRONTEND_URL

        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST,PUT,DELETE'
        return response

    return app
