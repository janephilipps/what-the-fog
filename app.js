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
	request = require("request"),
	session = require("express-session");
	// need to check docs socket = require("socket.io");

// Instantiate express app
var app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set up body parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up sessions
app.use(session({
	secret: 'super secret',
	resave: false,
	saveUninitialized: true
}))

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

// Route to login page

app.get('/login', function(req, res) {
	res.render('site/login');
})

// Route to list users

app.get('/users', function(req, res) {
	res.render('users/index')
});

// Route to new user

app.get('/users/new/', function(req, res) {
	res.render('users/new');
});

// Route to create user via sign-up form

app.post('/users', function(req, res) {
	// grab the user from the form
  var email = req.body.email;
  var password = req.body.password;

  // create the new user
  db.User.
    createSecure(email, password).
    then(function(){
        res.redirect("/login");
      });

});

// Route to show user

app.get('/users/:id', function(req, res) {
	res.render('/users/:id');
})

app.post('/users/:id', function(req, res) {
	// grab the user from the login page
	var email = req.body.email;
	var password = req.body.password;

	// check that the user exists in the db
	db.User.
		authenticate(email, password).
		find( {where: {email: email} } ).
		then(function() {
			res.redirect('/users/:id');
		})

});

// Route to edit user

app.get('/users/:id/edit', function(req, res) {

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

// app.get('/login', function(req,res){
//     res.send("I'm a login");
// });

// app.get('/signup', function(req,res){
//     res.send("I'm a signup");
// });

// app.post('/login', function(req,res){
//     res.send("success!");
// });

// app.post('/signup', function(req,res){
//     res.send("I'm a signup");
// });

// app.delete('/logout', function(req,res){
//     res.send("I'm a delete");
// });

// app.get('/profile', function(req,res){
//     res.send("I'm a profile");
// });


// Start the server on port 3000
app.listen(3000);
    
    