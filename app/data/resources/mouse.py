from flask_restful import Resource, reqparse
from flask import request, jsonify, Response
from app.data.models.mouse import MouseModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel


# class MouseList(Resource):
#     def get(self):
#         return {'items': [x.json() for x in MouseModel.query.all()]}

parser = reqparse.RequestParser()


class MouseList(Resource):
    def get(self):
        parser.add_argument('gene', type=str)
        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}

        order = request.args.get('order_by', 'number', type=str)
        # page = request.args.get('page', 1, type=int)
        # per_page = min(request.args.get('per_page', 10, type=int), 100)
        mice = MouseModel.query
        if new_args.get('gene'):
            mice = mice.filter(MouseModel.gene.has(GeneModel.gene_name.has(GeneNameModel.name == new_args.get('gene'))))
            new_args.pop('gene')

        data = {'items': [x.to_dict() for x in mice.filter_by(**new_args).order_by(order)]}

        # if file_type:
        #     return Response(str(data),
        #                     mimetype='application/json',
        #                     headers={'Content-Disposition': 'attachment;filename=slices.json'})

        # data = MouseModel.to_collection_dict(mice.filter_by(**new_args).order_by(order), page, per_page, 'mice')

        return jsonify(data)
