from flask_restful import Resource
from app.data.models.experiment import ExperimentModel


class ExperimentList(Resource):
    def get(self):
        return {'items': [x.json() for x in ExperimentModel.query.all()]}
