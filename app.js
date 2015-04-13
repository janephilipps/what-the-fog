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

// Set up login
app.use("/", function (req, res, next) {

  req.login = function (user) {
    req.session.userId = user.id;
  };

  req.currentUser = function () {
    return db.User.
      find({
        where: {
          id: req.session.userId
       }
      }).
      then(function (user) {
        req.user = user;
        return user;
      })
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }

  next(); 
});

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
});

// Route to login as a user
app.post('/login', function(req, res) {
	var user = req.body.user;
	var email = req.body.user.email;
	var password = req.body.user.password;

	db.User
		.authenticate(email, password)
		.then(function (user) {
			req.login(user);
			res.redirect('/profile');
		});
});

// Route to profile page
app.get('/profile', function(req, res) {
	req.currentUser()
		.then(function (user) {
			res.render('users/profile', {user: user});
		});
});

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
  var zip = req.body.zip;

  // create the new user
  db.User.
    createSecure(email, password, zip).
    then(function(){
        res.redirect("/login");
      });

});

// Route to show user
app.get('/users/:id', function(req, res) {
	req.currentUser()
		.then(function (user) {
			res.render("profile", {user: user})
		})

	res.render('/users/id');
})

app.post('/users/:id', function(req, res) {
	// grab the user from the login page
	var email = req.body.email;
	var password = req.body.password;

	// check that the user exists in the db
	db.User.
		authenticate(email, password)
		.then(function(user){
			res.render('users/profile', {user: user});
		});

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

app.get('/search', function(req, res) {
	var zipSearch = req.query.q3;
	if (!zipSearch) {
		res.render('/site/search', {zips: [], noZips: true});
	} else {
		var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipSearch;
		request(url, function(err, resp, body) {
			console.log("I'm in here 1")
			if (!err && resp.statusCode === 200) {
				console.log("I'm in here 2");
				var jsonData = JSON.parse(body);
				if (!jsonData.Search) {
					res.render('/site/search', {zips: [], noZips: true});
				}
				res.render('/site/search', {zips: jsonData.Search, noZips: false});
			}
		});
	}
});

// Make sure db tables are associated
  db.sequelize.sync().then(function() {
	// Start the server
    var server = app.listen(3000, function() {
    // This part just adds a snazzy listening message:
    console.log(new Array(51).join("*"));
    console.log("\t LISTENING ON: \n\t\t localhost:3000");
    console.log(new Array(51).join("*")); 
  });
});
    
    