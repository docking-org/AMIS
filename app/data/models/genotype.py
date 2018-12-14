from app import db


class GenotypeModel(db.Model):
    __tablename__ = 'genotype'

    id = db.Column(db.Integer, primary_key=True)
    type_id = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(200))
    genes = db.relationship('GeneModel', back_populates='genotype')

    def json(self):
        return {'id': self.id, 'type': self.type}

    @classmethod
    def find_by_id(cls, type_id):
        return cls.query.filter_by(type_id=type_id).first()

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
        return '<Genotype {}>'.format(self.type)
