from flask_restful import Resource, reqparse
from flask import request, jsonify, Response
from app.data.models.slice import SliceModel
from app.data.models.mouse import MouseModel
from app.data.models.organ import OrganModel
from app.data.models.experiment import ExperimentModel
from app.data.models.genotype import GenotypeModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.subtype import SubtypeModel
parser = reqparse.RequestParser()


class Slices(Resource):
    def get(self, file_type=None):
        parser.add_argument('id', type=int)
        parser.add_argument('mouse_number', type=str)
        parser.add_argument('experiment', type=str)
        parser.add_argument('gene', type=str)
        parser.add_argument('genotype_gene', type=str)
        parser.add_argument('genotype_reporter', type=str)
        parser.add_argument('sex', type=str)
        parser.add_argument('age', type=str)
        
        # 'mani_type': self.mouse.mani_type.type,
        parser.add_argument('organ', type=str)
        parser.add_argument('uberon', type=str)
        parser.add_argument('orientation', type=str)
        # parser.add_argument('slide_number', type=str) #excluded from list
        # parser.add_argument('sample_number', type=str) #excluded from list
        parser.add_argument('slice_id', type=int)
        # parser.add_argument('location_index', type=str) #excluded from list
        # parser.add_argument('z_step_size', type=float)
        parser.add_argument('objective', type=str)
        parser.add_argument('instrument', type=str)
        parser.add_argument('wavelength', type=str)
        parser.add_argument('probe_id', type=str)
        parser.add_argument('survey_classification', type=str)
      
        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}
        # print(new_args)
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 100)
        order = request.args.get('order_by', 'id', type=str)
        # data = SliceModel.to_collection_dict(SliceModel.query.
        # filter_by(**new_args), page, per_page, 'slices')
        slices = SliceModel.query
        if new_args.get('mouse_number'):
            slices = slices.filter(SliceModel.mouse.has(
                MouseModel.number == new_args.get('mouse_number')))
            new_args.pop('mouse_number')
        if new_args.get('sex'):
            slices = slices.filter(SliceModel.mouse.has(
                MouseModel.sex == new_args.get('sex')))
            new_args.pop('sex')
        if new_args.get('age'):
            slices = slices.filter(SliceModel.mouse.has(
                MouseModel.age == new_args.get('age')))
            new_args.pop('age')
        if new_args.get('organ'):
            slices = slices.filter(SliceModel.organ.has(
                OrganModel.name == new_args.get('organ')))
            new_args.pop('organ')
        if new_args.get('experiment'):
            slices = slices.filter(SliceModel.experiment.has(
                ExperimentModel.name == new_args.get('experiment')))
            new_args.pop('experiment')
        if new_args.get('gene'):
            slices = slices.filter(SliceModel.mouse.has(MouseModel.gene.has(
                GeneModel.gene_name.has(
                    GeneNameModel.name == new_args.get('gene')))))
            new_args.pop('gene')
        if new_args.get('genotype_gene'):
            slices = slices.filter(SliceModel.mouse.has(MouseModel.gene.has(
                GeneModel.genotype_gene.has(
                    GenotypeModel.type_id == new_args.get('genotype_gene')))))
            new_args.pop('genotype_gene')
        if new_args.get('genotype_reporter'):
            slices = slices.filter(SliceModel.mouse.has(MouseModel.gene.has(
                GeneModel.genotype_reporter.has(
                    GenotypeModel.type_id == new_args.get(
                        'genotype_reporter')))))
            new_args.pop('genotype_reporter')
        if new_args.get('instrument'):
            if new_args.get('instrument').lower() == 'histological':
                slices = slices.filter(SliceModel.instrument != 'LSM')
                new_args.pop('instrument')
            elif new_args.get('instrument').lower() != 'histological':
                slices = slices.filter(SliceModel.instrument == 'LSM')
                new_args.pop('instrument')
        data = SliceModel.to_collection_dict(
            slices.filter_by(**new_args).order_by(order), page, per_page,
            'slices')

        
        if file_type == 'json':

            return Response(str(data),
                            mimetype='application/json',
                            headers={
                                'Content-Disposition':
                                    'attachment;filename=slices.json'
                            })

        return jsonify(data)


# class SliceList(Resource):
#     def get(self):
#         data = {'items': [x.to_dict() for x in SliceModel.query.all()]}
#         return jsonify(data)
# return jsonify(SliceModel.query.all().to_dict())

class Filters(Resource):
    def get(self):
        parser.add_argument('gene', type=str)
        parser.add_argument('organ', type=str)
        parser.add_argument('experiment', type=str)
        # instrument
        parser.add_argument('subtype', type=str)
        parser.add_argument("instrument", type=str)

        args = parser.parse_args()
        new_args = {key: val for key, val in args.items() if val is not None}

        slices = SliceModel.query

        if new_args.get('gene'):
            slices = slices.filter(SliceModel.mouse.has(
                MouseModel.gene.has(GeneModel.gene_name.has(
                    GeneNameModel.name == new_args.get('gene')))))
            new_args.pop('gene')
        if new_args.get('subtype'):
            slices = slices.filter(SliceModel.mouse.has(
                MouseModel.subtype.has(SubtypeModel.subtype_name == new_args.get(
                    'subtype'))))
            new_args.pop('subtype')
        if new_args.get('organ'):
            slices = slices.filter(
                SliceModel.organ.has(OrganModel.name == new_args.get('organ')))
            new_args.pop('organ')
        if new_args.get('experiment'):
            slices = slices.filter(SliceModel.experiment.has(
                ExperimentModel.name == new_args.get('experiment')))
            new_args.pop('experiment')
        if new_args.get('instrument'):
            if new_args.get('instrument').lower() == 'histological':
                slices = slices.filter(SliceModel.instrument != 'LSM')
                new_args.pop('instrument')
            elif new_args.get('instrument').lower() != 'histological':
                slices = slices.filter(SliceModel.instrument == 'LSM')
                new_args.pop('instrument')
        data = SliceModel.to_menu_filter_dict(slices.filter_by(**new_args))

        return jsonify(data)
