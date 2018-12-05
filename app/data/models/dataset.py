from app import db


class DataSetModel(db.Model):
    __tablename__ = 'dataset'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500))
    date = db.Column(db.DateTime, index=True)
    img_path = db.Column(db.String(500))
    gene_id = db.Column(db.Integer, db.ForeignKey('gene.id'), nullable=True)
    gene = db.relationship("GeneModel", back_populates="datasets")
    cmpd_id = db.Column(db.Integer, db.ForeignKey('compound.id'), nullable=True)
    compound = db.relationship("CompoundModel", back_populates="datasets")
    organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=True)
    organ = db.relationship("OrganModel", back_populates="datasets")
    op_id = db.Column(db.Integer, db.ForeignKey('operator.id'), nullable=True)
    operator = db.relationship("OperatorModel", back_populates="datasets")
    sample_id = db.Column(db.Interval, db.ForeignKey('sample.id'), nullable=True)
    sample = db.relationship("SampleModel", back_populates="datasets")
    scan_id = db.Column(db.Interval, db.ForeignKey('scan.id'), nullable=True)
    scan = db.relationship("ScanModel", back_populates="datasets")

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
        return '<DataSet {}>'.format(self.description)
