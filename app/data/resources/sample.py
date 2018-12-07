from flask_restful import Resource, reqparse
from app.data.models.sample import SampleModel


class Sample(Resource):
    def get(self, name):
        sample = SampleModel.find_by_name(name)
        if sample:
            return sample.json()
        return {'message': 'Sample not found'}, 404


class SampleList(Resource):
    def get(self):
        return {'items': [x.json() for x in SampleModel.query.all()]}