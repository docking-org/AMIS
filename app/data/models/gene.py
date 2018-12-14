from app import db


class GeneModel(db.Model):
    __tablename__ = 'gene'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    genotype_id = db.Column(db.Integer, db.ForeignKey('genotype.id'), nullable=False)
    genotype = db.relationship("GenotypeModel", back_populates='genes')
    mice = db.relationship("MouseModel", back_populates='gene')

    def __init__(self, name, genotype_id):
        self.name = name
        self.genotype_id = genotype_id

    def json(self):
        return {'id': self.id, 'name': self.name}

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

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
        return '<Gene {}>'.format(self.name)
