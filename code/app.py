from flask import Flask, request, jsonify
from flask_restful import Api, reqparse

from resources.login import Login # this is where the OUATH functionality come from.
from resources.user import User, RegisterUser

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

# SQLAlchemy to create all the necesiry tables before start
@app.before_first_request
def create_tables():
    print('Creating tables')
    db.create_all()
    
#Allows Origin for the front end to interact.
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

api = Api(app)

# configration for SQLALCHEMT
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api.add_resource(Login, '/login')
api.add_resource(User, '/user/<string:email>')

api.add_resource(RegisterUser, '/user/register')

if __name__ == '__main__':
    from db import db
    db.init_app(app)
    app.secret_key = 'super_secret_key'
    app.run(port=5555, debug=True)