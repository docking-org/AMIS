from app import db
from flask import current_app, url_for


class PaginatedAPIMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        if per_page == -1:
            return  {'items': [item.to_dict() for item in query.all()]}
        else:
            resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }
        return data


class MouseModel(PaginatedAPIMixin, db.Model):
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

    def to_dict(self):
        data = {
            'id': self.id,
            'number': self.number,
            'sex': self.sex,
            'age': self.age,
            'gene': self.gene.gene_name.name,
            'spec': "-" if self.gene.genotype_gene.type_id == 0 or self.gene.genotype_reporter.type_id == 0 else "+",
            'mani_type': self.mani_type.type
        }
        return data

    @property
    def slices_count(self):
        return len(list(self.slices))

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
            'gene': self.gene.gene_name.name,
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
