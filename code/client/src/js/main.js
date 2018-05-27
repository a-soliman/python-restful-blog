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
        console.log('from localStorage', localStorage.getItem('access_token'))

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
        console.log('test')
    }

    /* END */

    

    
}

/* 
    THE NEXT SET OF METHODS ARE THE ACTUAL API CALLS 
                USING FETCH API
    -------------------------------------------------
*/

/* Fetch GET Requiest to to the REST API to get a list of movies */
function fetchMovies() {
    fetch('http://localhost:5000')
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
                viewModel.movies(data.movies)
            })
        })
        .catch( function( err ) {
            console.log('Fetch Error :-S', err);
        })
}


/* Fetch DELETE Requiest to to the REST API */
function deleteMovie(_id) {
    return fetch(`http://localhost:5000/${_id}`, {
        method: 'delete'
    })
    .then ( ( response ) => {
        if (response.status !== 200 ) {
            console.log('Looks like the backend server is not running on port 5000. ' + response.status);
            response.json().then( ( data ) => {
                viewModel.failuerMessage(data.message)
            })
            return
        }
        response.json().then( ( data ) => {
            viewModel.successMessage(data.message)
            viewModel.removeMovieLocally(_id);
        })
    })
};
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
/* Fetch POST Requiest to to the REST API */
function postMovie(movie) {
    return fetch(`http://localhost:5000/add`, {
        body: JSON.stringify(movie),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
    .then( ( response ) => {
        if (response.status !== 201 ) {
            console.log('Looks like the backend server is not running on port 5000. ' + response.status);
            response.json().then( ( data ) => {
                viewModel.failuerMessage(data.message)
            })
            return false;
        }
        response.json().then( ( data ) => {
            viewModel.successMessage(data.message);
            viewModel.addMovieLocally(movie);
            return true;
        })
    })
};

/* Fetch PUT Requiest to to the REST API */
function putMovies(_id, editedMovie) {
    return fetch(`http://localhost:5000/${_id}`, {
        body: JSON.stringify(editedMovie),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'put'
    })
    .then( ( response ) => {
        if ( response.status !== 200 ) {
            console.log('Looks like the backend server is not running on port 5000. ' + response.status);
            response.json().then( ( data ) => {
                viewModel.failuerMessage(data.message)
            })
            return false;
        }
        response.json().then( ( data ) => {
            viewModel.successMessage(data.message);
            return true;
        })
    })
}


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
// APPLYES THE KNOCKOUT BINDINGS
ko.applyBindings(viewModel)


