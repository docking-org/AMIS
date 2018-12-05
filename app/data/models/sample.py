from app import db


class SampleModel(db.Model):
    __tablename__ = 'sample'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500))
    datasets = db.relationship("DataSetModel", back_populates='sample')

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
        return self.description

    def __repr__(self):
        return '<Sample {}>'.format(self.description)
