from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app(test_config=None):
    # create flask app
    app = Flask(__name__)
    # Connect to local database at 5432, username & password are postgres, db name is nottingham
    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:postgres@localhost:5432/nottingham'
    db.init_app(app)
    Migrate(app, db)

    from app.models import Example, Asset

    # other registrations

    return app