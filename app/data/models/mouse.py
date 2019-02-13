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

    @property
    def sex_string(self):
        if self.sex:
            return "male"
        else:
            return "female"

    def json(self):
        return {
            'id': self.id,
            'number': self.number,
            'sex': self.sex_string,
            'age': self.age,
            'gene': self.gene.name,
            'mani_type': self.mani_type.type,
        }

    @classmethod
    def find_by_number(cls, number):
        return cls.query.filter_by(number=number).first()

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
