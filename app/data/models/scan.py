from app import db


class ScanModel(db.Model):
    __tablename__ = 'scan'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500))
    date = db.Column(db.DateTime, index=True)
    datasets = db.relationship("DataSetModel", back_populates='scan')

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
        return '<Scan {}>'.format(self.description)
