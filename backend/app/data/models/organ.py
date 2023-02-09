from app import db


class OrganModel(db.Model):
    __tablename__ = 'organ'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True)
    description = db.Column(db.String(200))
    slices = db.relationship("SliceModel", back_populates='organ')
    lookups = db.relationship("LookupModel", back_populates='organ')

    def __init__(self, name):
        self.name = name

    def to_dict(self):
        return {'id': self.id, 'name': self.name}

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_all(cls):
        return cls.query.order_by("name").all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def __str__(self):
        return self.name

    def __repr__(self):
        return '<Organ {}>'.format(self.name)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}
