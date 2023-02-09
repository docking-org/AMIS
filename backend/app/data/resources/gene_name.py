from flask_restful import Resource, reqparse
from app.data.models.gene_name import GeneNameModel
from flask import jsonify

parser = reqparse.RequestParser()


class GeneNames(Resource):
    def get(self):
        parser.add_argument('id', type=int)
        parser.add_argument('name', type=str)

        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}

        data = GeneNameModel.query.filter_by(**new_args).all()
        data = {'items': [x.to_dict() for x in data]}

        return jsonify(data)
