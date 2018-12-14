from app import db


class ManipulationTypeModel(db.Model):
    __tablename__ = 'mani_type'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(200))
    mice = db.relationship("MouseModel", back_populates='mani_type')

    def __init__(self, type):
        self.type = type

    def json(self):
        return {'id': self.id, 'type': self.type}

    @classmethod
    def find_by_name(cls, type):
        return cls.query.filter_by(type=type).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def __str__(self):
        return self.type

    def __repr__(self):
        return '<ManipulationType {}>'.format(self.type)
