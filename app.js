// Require modules
var db = require('./models');
var bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(10),
	bodyParser = require("body-parser"),
	// need to check docs bootstrap = require("bootstrap"),
	ejs = require("ejs"),
	express = require("express"),
	methodOverride = require("method-override"),
	pgHstore = require("pg-hstore"),
	request = require("request");
	// need to check docs socket = require("socket.io");

// Instantiate express app
var app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set up body parser
app.use(bodyParser.urlencoded({extended: false}));

// Set up method override to work with POST requests that have the parameter "_method=DELETE"
app.use(methodOverride('_method'))

// Route to site index

app.get('/', function(req, res) {
	res.render('site/index');
});

// Route to site about

app.get('/about', function(req, res) {
	res.render('site/about');
});

// Route to site contact

app.get('/contact', function(req, res) {
	res.render('site/contact');
});

// Route to list users

app.get('/users', function(req, res) {
	res.render('users/index')
});

// Route to new user

app.get('/users/new/', function(req, res) {
	res.render('users/new');
});

// Route to show user

app.get('/users/:id', function(req, res) {

});

// Route to edit user

app.get('/users/:id/edit', function(req, res) {

});

// Route to create user

app.post('/users', function(req, res) {

});

// Route to update user - *PATCH*

app.get('/users/:id', function(req, res) {

});

// Route to delete user - *DELETE*

app.get('/users/:id', function(req, res) {

});

// Route to list locations

app.get('/locations', function(req, res) {
	res.render('locations/index')
});

// Route to new location

app.get('/locations/new', function(req, res) {
	res.render('locations/new');
});

// Route to show location

app.get('/locations/:id', function(req, res) {

});

// Route to edit location

app.get('/locations/:id/edit', function(req, res) {

});

// Route to create location

app.post('/locations', function(req, res) {

});

// Route to update location - *PATCH*

app.get('/locations/:id', function(req, res) {

});

// Route to delete location - *DELETE*

app.get('/locations/:id', function(req, res) {

});


// Start the server on port 3000
app.listen(3000);
    
    