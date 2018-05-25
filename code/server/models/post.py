import sqlite3

from db import db

class PostModel(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    body = db.Column(db.String(2000))
    user= db.Column(db.Integer)

    def __init__(self, _id, title, body, user):
        self.id = _id
        self.title = title
        self.body = body
        self.user = user
        self.owner = None

    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "user": self.user,
            "owner": self.owner
        }

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def find_by_userid(cls, user_id):
        return cls.query.filter_by(user=user_id).all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return
    
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        return
