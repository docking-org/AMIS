from flask_restful import Resource, reqparse
from flask import request, jsonify
from app.data.models.mouse import MouseModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.slice import SliceModel
from app.data.models.organ import OrganModel
from app.data.models.experiment import ExperimentModel

# class MouseList(Resource):
#     def get(self):
#         return {'items': [x.json() for x in MouseModel.query.all()]}

parser = reqparse.RequestParser()


class MouseList(Resource):
    def get(self):
        parser.add_argument('gene', type=str)
        parser.add_argument('organ', type=str)
        parser.add_argument('instrument', type=str)
        parser.add_argument('experiment', type=str)
        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}

        order = request.args.get('order_by', 'number', type=str)
        # page = request.args.get('page', 1, type=int)
        # per_page = min(request.args.get('per_page', 10, type=int), 100)
        mice = MouseModel.query
        if new_args.get('gene'):
            mice = mice.filter(MouseModel.gene.has(GeneModel.gene_name.has(
                GeneNameModel.name == new_args.get('gene'))))
            new_args.pop('gene')
        if new_args.get('organ'):
            mice = mice.filter(MouseModel.slices.any(
                SliceModel.organ.has(
                    OrganModel.name == new_args.get('organ'))))
            new_args.pop('organ')
        if new_args.get('instrument'):
            if new_args.get('instrument').lower() == 'histological':
                mice = mice.filter(
                    MouseModel.slices.any(SliceModel.instrument != 'LSM'))
            else:
                mice = mice.filter(
                    MouseModel.slices.any(SliceModel.instrument == 'LSM'))
            new_args.pop('instrument')
        if new_args.get('experiment'):
            mice = mice.filter(
                MouseModel.slices.any(SliceModel.experiment.has(
                    ExperimentModel.name == new_args.get('experiment'))))
            new_args.pop('experiment')

        data = {'items': [x.to_dict() for x in
                          mice.filter_by(**new_args).order_by(order)]}

        # if file_type:
        #     return Response(str(data),
        #                     mimetype='application/json',
        #                     headers={'Content-Disposition':
        #                     'attachment;filename=slices.json'})

        # data = MouseModel.to_collection_dict(
        # mice.filter_by(**new_args).order_by(order), page, per_page, 'mice')

        return jsonify(data)
