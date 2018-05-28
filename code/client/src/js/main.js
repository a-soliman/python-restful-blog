/* Knockout data binding and templating */
var viewModel = {
    posts: ko.observableArray(),
    categories: ko.observableArray(),
    loggedinUser: ko.observable(),
    successMessage: ko.observable(),
    failuerMessage: ko.observable(),

    checkLoggedinUser: () => {
        if (localStorage.getItem('access_token') != null) {
            viewModel.loggedinUser(true)
        }
        else {
            viewModel.loggedinUser(false)
        }
    },

    signin: () => {
        const inputs = viewModel.signinInputs;
        const { email, password } = inputs;
        const elementsArray = [ email, password ];
        
        for ( let i in elementsArray ){
            let element = elementsArray[i];
            if ( element.valid() !== true ) {
                element.valid(false);
                return;
            }
        }
        let user = {
            email: email.value(),
            password: password.value()
        }
        
        if( do_signin(user) ) {
            
            // clear the modal form and hide it
            $('.modal').modal('hide');
            viewModel.fetchData()
        }
    },

     /* Values of the Signin form */
     signinInputs: {
        email : {
            value: ko.observable(''),
            valid: ko.observable()
        },
        password: {
            value: ko.observable(''),
            valid: ko.observable()
        }
    },

    // A SET OF FUNCTIONS TO VALIDATE EACH INPUT FIELD 
    validateSigninInputs: {
        validateEmail: () => {
            let email = viewModel.signinInputs.email;

            if ( email.value().length < 6 || email.value().indexOf('@') == -1) {
                email.valid(false);
                return;
            }
            email.valid(true);
            return;
        },
        validatePassword: () => {
            let password = viewModel.signinInputs.password;

            if ( password.value().length < 6 || password.value().indexOf(' ') != -1){
                password.valid(false);
                return
            }
            password.valid(true);
            return;
        }
    },

    // A function to handle and store the access_token
    saveAccessToken: (access_token) => {
        console.log('recived access token');
        localStorage.setItem('access_token', access_token);
        console.log('from localStorage', localStorage.getItem('access_token'));
        viewModel.fetchData()

    },
    

    // SignUp functions
    signup: () => {
        const inputs = viewModel.signupInputs;
        const { username, email, password } = inputs;
        const elementsArray = [ username, email, password ];
        
        for ( let i in elementsArray ){
            let element = elementsArray[i];
            if ( element.valid() !== true ) {
                element.valid(false);
                return;
            }
        }
        let user = {
            username: username.value(),
            password: password.value(),
            email: email.value()
        }
        
        if( do_signup(user) ) {
            //sign the user in
            let userToLogin = {'email': user.email, 'password': user.password}
            $('.modal').modal('hide');
            viewModel.successMessage('You are now digned up, and can login..')
        }
    },

     /* Values of the Signup form */
     signupInputs: {
        username : {
            value: ko.observable(''),
            valid: ko.observable()
        },
        email : {
            value: ko.observable(''),
            valid: ko.observable()
        },
        password: {
            value: ko.observable(''),
            valid: ko.observable()
        }
    },

    // A SET OF FUNCTIONS TO VALIDATE EACH INPUT FIELD 
    validateSignupInputs: {
        validateUsername: () => {
            let username = viewModel.signupInputs.username;

            if ( username.value().length < 2 ) {
                username.valid(false);
                return;
            }
            username.valid(true);
            return;
        },
        validateEmail: () => {
            let email = viewModel.signupInputs.email;

            if ( email.value().length < 6 || email.value().indexOf('@') == -1) {
                email.valid(false);
                return;
            }
            email.valid(true);
            return;
        },
        validatePassword: () => {
            let password = viewModel.signupInputs.password;

            if ( password.value().length < 6 || password.value().indexOf(' ') != -1){
                password.valid(false);
                return
            }
            password.valid(true);
            return;
        }
    },

    // Signout
    signout: () => {
        // clear the access_token from local storage
        localStorage.removeItem('access_token')
        viewModel.removeDataFromView()
        viewModel.loggedinUser(false)
    },

    getCategories: () => {
        fetch('http://localhost:5555/categories')
        .then( function(response) {
            if (response.status !== 200 ) {
                console.log('Looks like the backend server is not running on port 5000. ' + response.status);
                response.json().then( ( data ) => {
                    viewModel.failuerMessage(data.message)
                })
                return
            }
            response.json().then(function(data) {

                //append the movies to the viewModel
                viewModel.categories(data.categories)
                console.log(data)
            })
        })
        .catch( function( err ) {
            console.log('Fetch Error :-S', err);
        })
    },

    getPosts: () => {
        console.log('getPosts called')
        if (localStorage.getItem('access_token') == null) {
            console.log('getPosts called, NO access toke... aborting')
            return;
        }

        do_getPosts();
    },

    // SignUp functions
    addPost: () => {
        const inputs = viewModel.addPostInputs;
        const { title, body } = inputs;
        const elementsArray = [title, body ];
        
        // validate the category input
        let categoryValue = $('#category').val();
        console.log(categoryValue)
        if ( categoryValue.length < 1) {
            console.log('aborting...')
            return false;
        }


        for ( let i in elementsArray ){
            let element = elementsArray[i];
            if ( element.valid() !== true ) {
                element.valid(false);
                return;
            }
        }
        
        let newPost = {
            category_id: categoryValue,
            title: title.value(),
            body: body.value()
        }
        
        if( do_addPost(newPost) ) {
            // Add the post locally
            $('.modal').modal('hide');
            viewModel.successMessage('Added Post successfully.')
        }
    },

     /* Values of the addPost form */
     addPostInputs: {
        category : {
            value: ko.observable(''),
            valid: ko.observable()
        },
        title : {
            value: ko.observable(''),
            valid: ko.observable()
        },
        body: {
            value: ko.observable(''),
            valid: ko.observable()
        }
    },

    // A SET OF FUNCTIONS TO VALIDATE EACH INPUT FIELD 
    validateAddPostInputs: {
        validateCategory: () => {
            let category = viewModel.addPostInputs.category;
            console.log(category.value())
            if ( category.value().length > 0 ) {
                console.log('false: ', category.value())
                valid.valid(false);
                return;
            }
            category.valid(true);
            return;
        },
        validateTitle: () => {
            let title = viewModel.addPostInputs.title;

            if ( title.value().length < 6) {
                title.valid(false);
                return;
            }
            title.valid(true);
            return;
        },
        validateBody: () => {
            let body = viewModel.addPostInputs.body;

            if ( body.value().length < 6){
                body.valid(false);
                return
            }
            body.valid(true);
            return;
        }
    },

    fetchData: () => {
        if ( localStorage.getItem('access_token') == null) {
            return;
        }
        viewModel.getCategories()
        viewModel.getPosts()
    },

    removeDataFromView: () => {
        viewModel.posts.removeAll()
        viewModel.categories.removeAll()
    },

    removePost: (data) => {
        let post_id = data.id;
        if (do_deletePost(post_id)) {
            console.log('removed from the server')
            
        }
    },

    removePostLocally: (post_id) => {
        viewModel.posts.remove(function (item) {
            return item.id == post_id;
        });
    }

    /* END */

    

    
}

/* 
    THE NEXT SET OF METHODS ARE THE ACTUAL API CALLS 
                USING FETCH API
    -------------------------------------------------
*/

/* Fetch POST Requiest to to the REST API */
function do_signin(user) {
    return fetch(`http://localhost:5555/auth`, {
        body: JSON.stringify(user),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
    .then( ( response ) => {
        if (response.status === 200) {
            response.json().then( ( data ) => {
                let access_token = data.access_token;
                viewModel.saveAccessToken(access_token);
                // signal that a user is in
                viewModel.loggedinUser(true)
                
                viewModel.successMessage('You are now loggedIn successfully!');
                return true;
            })
        }
        else if ( response.status === 401 ) {
            console.log('Looks like the backend server is not running on port 5555. ' + response.status);
            response.json().then( ( data ) => {
                console.log(data)
                let message = `${data.description}, Please try again!`
                viewModel.failuerMessage(data.description)
                return false;
            })
        }
        else if ( response.status === 500 ) {
            console.log('Looks like the backend server is not running on port 5555. ' + response.status);
            response.json().then( ( data ) => {
                console.log(data)
                let message = `server error, Please try again later!`
                viewModel.failuerMessage(data.description)
                return false;
            })
        }
        
    })
};

function do_signup(user) {
    return fetch(`http://localhost:5555/user/register`, {
        body: JSON.stringify(user),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
    .then( ( response ) => {
        if (response.status === 201) {
            response.json().then( ( data ) => {
                viewModel.successMessage('You are now digned up, and may login successfully!');
                return true;
            })
        }
        else if ( response.status === 401 ) {
            console.log('Looks like the backend server is not running on port 5555. ' + response.status);
            response.json().then( ( data ) => {
                console.log(data)
                let message = `${data.description}, Please try again!`
                viewModel.failuerMessage(data.description)
                return false;
            })
        }
        else if ( response.status === 500 ) {
            console.log('Looks like the backend server is not running on port 5555. ' + response.status);
            response.json().then( ( data ) => {
                console.log(data)
                let message = `server error, Please try again later!`
                viewModel.failuerMessage(data.description)
                return false;
            })
        }
    })
};




function GsignInCallback(authResult) {
    const data = {code: authResult['code']}
    console.log(JSON.stringify(data))
    
    console.log('before: ', JSON.stringify(data))
    fetch("http://localhost:5555/login", {
        method: 'POST',
        
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'appication/json'
        },
        body: JSON.stringify(data),
        cache: 'no-cache',
    })
    .then( ( response ) => {
        return response.json()
    }).then( ( data ) => {
        do_signin({'email': data.email, 'password': 'default_password'});
        $('.modal').modal('hide');
        
    })

    console.log('Gconnect called')
}

function do_addPost(post) {
    return fetch(`http://localhost:5555/post/add`, {
        body: JSON.stringify(post),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json',
            'authorization': `JWT ${localStorage.getItem('access_token')}`
        },
        method: 'POST'
    })
    .then( ( response ) => {
        if (response.status === 401 ) {
            response.json().then( ( data ) => {
                viewModel.failuerMessage(data.message);
                return false;
            })
            
        }
        response.json().then( ( data ) => {
            viewModel.successMessage(data.message);
            // viewModel.addMovieLocally(movie);
            console.log(data)
            return true;
        })
    })
}

function do_getPosts() {
    fetch('http://localhost:5555/posts', {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access_token')}`
        }
    })
        .then( function(response) {
            if (response.status !== 200 ) {
                console.log('Looks like the backend server is not running on port 5000. ' + response.status);
                response.json().then( ( data ) => {
                    viewModel.failuerMessage(data.message)
                })
                return
            }
            response.json().then(function(data) {
                console.log(data)
                //append the movies to the viewModel
                viewModel.posts(data.posts)
            })
        })
        .catch( function( err ) {
            console.log('Fetch Error :-S', err);
        })
}

function do_deletePost(post_id) {
    fetch(`http://localhost:5555/post/${post_id}`, {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access_token')}`
        },
        method: 'DELETE'
    })
    .then((response) => {
        if (response.status == 401) {
            viewModel.failuerMessage('Not Authorized to remove this post.')
            return false;
        }
        else if (response.status === 500) {
            viewModel.failuerMessage('Something went wrong, please try again later')
            return false;
        }
        else if (response.status === 200) {
            response.json().then((data) => {
                console.log(data);
                viewModel.removePostLocally(post_id)
                return true;
            })
        }
        else {
            console.log('weired stuff happend')
        }
    })
}
// APPLYES THE KNOCKOUT BINDINGS
ko.applyBindings(viewModel)


