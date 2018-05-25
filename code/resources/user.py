from flask import request, jsonify
from flask_restful import Resource, reqparse

class User(Resource):
    def get(self, email):
        pass