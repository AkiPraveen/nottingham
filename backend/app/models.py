from app import db

class Example(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(), unique=True, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)