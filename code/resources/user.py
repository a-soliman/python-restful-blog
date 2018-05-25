from flask import request, jsonify
from flask_restful import Resource, reqparse

from models.user import UserModel

class User(Resource):
    def get(self, email):
        user = UserModel.find_by_email(email)

        if user is None:
            return {'success': False, 'message': 'User not found'}, 404
        return user.json(), 400