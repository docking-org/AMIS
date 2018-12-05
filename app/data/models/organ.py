from app import db


class OrganModel(db.Model):
    __tablename__ = 'organ'

    id = db.Column(db.Integer, db.Sequence('organ_id_seq'), primary_key=True)
    name = db.Column(db.String(200))
    description = db.Column(db.String(500))
    datasets = db.relationship("DataSetModel", back_populates='organ')

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
        return self.name

    def __repr__(self):
        return '<Organ {}>'.format(self.name)
