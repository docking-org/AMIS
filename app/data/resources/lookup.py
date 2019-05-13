from flask_restful import Resource, reqparse
from app.data.models.lookup import LookupModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.organ import OrganModel
from flask import jsonify

parser = reqparse.RequestParser()


class LookupList(Resource):
    def get(self):
        parser.add_argument('id', type=int)
        parser.add_argument('gene_name_id', type=int)
        parser.add_argument('organ_id', type=int)
        parser.add_argument('gene_name', type=str)
        parser.add_argument('organ_name', type=str)

        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}

        lookup = LookupModel.query
        if new_args.get('gene_name'):
            lookup = lookup.filter(LookupModel.gene_name.has(GeneNameModel.name == new_args.get('gene_name')))
            new_args.pop('gene_name')
        if new_args.get('organ_name'):
            lookup = lookup.filter(LookupModel.organ.has(OrganModel.name == new_args.get('organ_name')))
            new_args.pop('organ_name')

        data = lookup.filter_by(**new_args).all()

        data = {'items': [x.to_dict() for x in data]}
        return jsonify(data)
