var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));

const key = 'THIS_IS_KEY'
const token = 'THIS_IS_TOKEN'
const validateUsername = 'peter'
const validatePassword = 'password'

const verifyReferer = (fullUrl, partialUrl) => (fullUrl)? fullUrl.indexOf(partialUrl) !== -1 : false 

const genErrorHtml = errMsg =>  `<script>
                                window.location = "/error?msg=${errMsg}"
                                </script>`

app.get('/', function (req, res) {
    res.type('html').send(
        `<form action="/handler" method="post">
            First name: <input type="text" name="username" value="Mickey"><br>
            Last name: <input type="text" name="password" value="Mouse"><br>
            <input type="submit" value="Submit">
        </form>`
        );
})

app.post('/handler', function (req, res) {
    const _username = req.body.username
    const _password = req.body.password
    const verifyUsernamePassword = (__username, __password) => {
        return (__username ===validateUsername && __password===validatePassword)
    }

    if(verifyUsernamePassword(_username, _password)){
        res.type('html').send(
            `<script>
            window.location = "/validate?key=${key}"
            </script>`
        )
    } else {
        const msg = 'Invalid user information'
        res.type('html').send(genErrorHtml(msg))        
    }
})

app.get('/validate', function (req, res) {    
    const _key = req.query.key
    const verifyKey = __key => __key === key

    if(verifyKey(_key)) {
        res.type('html').send(
            `<script>
                window.location = "/profile"
            </script>`
        )
    } else {
        const msg = 'Internal server error'
        res.type('html').send(genErrorHtml(msg))
    }
})

app.get('/error', function (req, res) {
    const _msg = req.query.msg
    res.type('html').send(
                            `<h1>
                                Error
                            </h1>
                            <p>${_msg}</p>`
                        );
})

app.get('/profile', function (req, res) {
    if(verifyReferer(req.header('Referer'), '/validate')){
        res.type('html').send(
            `<h1>
                Welcome back
            </h1>
            <p>${validateUsername}</p>`
        );
    } else {
        const msg = 'Referer Error'
        res.type('html').send(genErrorHtml(msg))        
    }
})

app.get('*', function (req, res) {
    res.type('html').send(`<script>window.location = "/"</script>`)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})