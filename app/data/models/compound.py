from app import db


class CompoundModel(db.Model):
    __tablename__ = 'compound'

    id = db.Column(db.Integer, primary_key=True)
    # mol = db.Column(db.Mol)
    zinc_id = db.Column(db.String(200))
    datasets = db.relationship("DataSetModel", back_populates='compound')

    def json(self):
        return {'id': self.id, 'zinc_id': self.zinc_id}

    @classmethod
    def find_by_name(cls, zinc_id):
        return cls.query.filter_by(name=zinc_id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
    #
    # def __str__(self):
    #     return self.id
    #
    # def __repr__(self):
    #     return '<Compound {}>'.format(self.id)
