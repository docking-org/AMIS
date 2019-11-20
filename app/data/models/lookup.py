from app import db
from app.data.models.slice import SliceModel


class LookupModel(db.Model):
    __tablename__ = 'lookup'

    id = db.Column(db.Integer, primary_key=True)
    gene_name_id = db.Column(db.Integer,
                             db.ForeignKey('gene_name.id'), nullable=False)
    gene_name = db.relationship("GeneNameModel", back_populates='lookups')
    organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=False)
    organ = db.relationship("OrganModel", back_populates='lookups')
    status = db.Column(db.Boolean)
    t_pos = db.Column(db.String(500), nullable=True)
    t_neg = db.Column(db.String(500), nullable=True)
    d_pos = db.Column(db.String(500), nullable=True)
    d_neg = db.Column(db.String(500), nullable=True)

    # def __init__(self, gene, organ, status, t_pos, t_neg, d_pos, d_neg):
    #     self.gene = gene
    #     self.organ = organ
    #     self.status = status
    #     self.t_pos = t_pos
    #     self.t_neg = t_neg
    #     self.d_pos = d_pos
    #     self.d_neg = d_neg

    def to_dict(self):
        return {
            'id': self.id,
            'gene_name_id': self.gene_name.id,
            'gene_name': self.gene_name.name,
            'organ_id': self.organ.id,
            'organ_name': self.organ.name,
            'status': "+" if self.status else "-",
            't_pos': SliceModel.find_img_by_checksum(self.t_pos),
            't_neg': SliceModel.find_img_by_checksum(self.t_neg),
            'd_pos': SliceModel.find_img_by_checksum(self.d_pos),
            'd_neg': SliceModel.find_img_by_checksum(self.d_neg),
        }

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
        return '<Lookup {}>'.format(self.status)
