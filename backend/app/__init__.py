from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from app.routers.home import home_blueprint

db = SQLAlchemy()
def create_app(test_config=None):
    # create flask app
    app = Flask(__name__)
    # Connect to local database at 5432, username & password are postgres, db name is nottingham
    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:postgres@localhost:5432/nottingham'
    db.init_app(app)
    Migrate(app, db)

    from app.models.asset import Asset

    app.register_blueprint(home_blueprint)

    return app