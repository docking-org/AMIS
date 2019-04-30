from app import db


class GeneModel(db.Model):
    __tablename__ = 'gene'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    genotype_gene_id = db.Column(db.Integer, db.ForeignKey('genotype.id'), nullable=False)
    genotype_gene = db.relationship("GenotypeModel",
                                    foreign_keys='GeneModel.genotype_gene_id')
    genotype_reporter_id = db.Column(db.Integer, db.ForeignKey('genotype.id'), nullable=False)
    genotype_reporter = db.relationship("GenotypeModel",
                                        foreign_keys='GeneModel.genotype_reporter_id')
    mice = db.relationship("MouseModel", back_populates='gene')

    def __init__(self, name, genotype_gene, genotype_reporter):
        self.name = name
        self.genotype_gene_id = genotype_gene.id
        self.genotype_gene = genotype_gene
        self.genotype_reporter_id = genotype_reporter.id
        self.genotype_reporter = genotype_reporter

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'genotype_gene':self.genotype_gene.type_id,
            'genotype_reporter':self.genotype_reporter.type_id,
            'slice_count':sum(item.slices_count for item in self.mice),
            'expression': "-" if self.genotype_gene.type_id == 0 or self.genotype_reporter.type_id == 0 else "+",
        }

    @classmethod
    def find_unique_names(cls):
        return cls.query.distinct(cls.name).all()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).all()

    @classmethod
    def find_by_name_ids(cls, name, genotype_gene, genotype_reporter):
        return cls.query.filter_by(name=name).\
            filter_by(genotype_gene=genotype_gene).filter_by(genotype_reporter=genotype_reporter).first()

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
