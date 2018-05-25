const serverURI = 'http://localhost:5555'

function signInCallback(authResult) {
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
        console.log(data)
    })
}
