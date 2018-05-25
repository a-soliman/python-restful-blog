

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
        for user in users:
            if user.username == username:
                return user
        return None
    
    @classmethod
    def find_by_id(cls, id):
        for user in users:
            if user.id == id:
                return user
        return None
    
    @classmethod
    def find_by_email(cls, email):
        for user in users:
            if user.email == email:
                return user
        return None

    def save_to_db(self):
        pass
    
    def delete_from_db(self):
        pass
    
ahmed = UserModel(1, 'Ahmed', '123456', 'ahmed@mail.com')

users = [ahmed]
