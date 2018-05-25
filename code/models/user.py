

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
    