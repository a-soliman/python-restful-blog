

class UserModel():
    
    def __init__(self, _id, username, password, email):
        self.id = _id
        self.username = username
        self.password = password
        self.email = email
    
    def json(self):
        return {
            'id': self.id, 
            'username': self.username, 
            'password': self.password, 
            'email': self.email
        }
    @classmethod
    def find_by_username(cls, username):
        pass
    
    @classmethod
    def find_by_id(cls, id):
        pass

    def save_to_db(self):
        pass
    
    def delete_from_db(self):
        pass
    