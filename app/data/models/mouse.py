from app import db


class MouseModel(db.Model):
    __tablename__ = 'mouse'

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(200))
    sex = db.Column(db.Boolean)
    age = db.Column(db.String(40))
    gene_id = db.Column(db.Integer, db.ForeignKey('gene.id'), nullable=False)
    gene = db.relationship("GeneModel", back_populates='mice')
    mani_type_id = db.Column(db.Integer, db.ForeignKey('mani_type.id'), nullable=False)
    mani_type = db.relationship("ManipulationTypeModel", back_populates='mice')
    slices = db.relationship("SliceModel", back_populates='mouse')

    def __init__(self, number, sex, age, gene, mani_type):
        self.number = number
        self.sex = sex
        self.age = age
        self.gene = gene
        self.mani_type = mani_type

    def json(self):
        return {'name': self.number, 'symbol': self.number}

    @classmethod
    def find_by_name(cls, number):
        return cls.query.filter_by(name=number, ).first()

    @classmethod
    def find_by_name(cls, number):
        return cls.query.filter_by(name=number).first()

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
        return self.number

    def __repr__(self):
        return '<Mouse {}>'.format(self.number)
