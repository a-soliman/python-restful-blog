from flask_restful import Resource, reqparse
from flask_jwt import JWT, jwt_required, current_identity

from models.post import PostModel

class Post(Resource):
    @jwt_required()
    def get(self):
        print(current_identity.id)
        return{'message': 'hey'}
    

class AddPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('title',
        type = str,
        required = True,
        help = 'title is required.'  
    )
    
    parser.add_argument('body', 
        type = str,
        required = True,
        help = 'body is required.'
    )

    @jwt_required()
    def post(self):
        # get the current user's id
        user_id = current_identity.id
        # get the post data
        data = AddPost.parser.parse_args()
        # Create a new post using the data and user_id
        post = PostModel(None, data['title'], data['body'], user_id)

        # Try saving the post
        try:
            post.save_to_db()
        except:
            return {'success': False, 'message': 'Something went wrong'}, 500
        
        return {'sucess': 'Created successfully'}, 201

class ListPosts(Resource):
    @jwt_required()
    def get(self):
        
        #store current user id
        user_id = current_identity.id
        posts = [post for post in PostModel.query.all()]

        for post in posts:
            if post.user == user_id:
                post.owner = True
            else:
                post.owner = False
                
        return {'posts': [post.json() for post in posts]}