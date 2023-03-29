from app import db


class Position(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
