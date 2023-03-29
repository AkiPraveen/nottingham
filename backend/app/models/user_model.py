import hashlib

from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    # store hashed password here
    password = db.Column(db.String(), nullable=False)

    # balance that can be used in the stock market
    balance = db.Column(db.Integer, default=0, nullable=False)
