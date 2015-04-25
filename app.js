// Require modules
var db = require('./models');
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var bodyParser = require("body-parser");
var ejs = require("ejs");
var express = require("express");
var methodOverride = require("method-override");
var pgHstore = require("pg-hstore");
var request = require("request");
var session = require("express-session");
var env = process.env;

// Instantiate express app
var app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// MIDDLEWARE

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set up sessions
app.use(session({
	secret: 'super secret',
	resave: false,
	saveUninitialized: true
}));

// Set up static assets
app.use(express.static('public'));

// Set up login
app.use("/", function (req, res, next) {
	// Define login request
  req.login = function (user) {
    req.session.UserId = user.id;
  };
  // Define current user request
  req.currentUser = function () {
    return db.User
      .find({
        where: {
          id: req.session.UserId
       }
      })
      .then(function (user) {
        req.user = user;
        return user;
      });
  };
  // Define logout request
  req.logout = function () {
    req.session.UserId = null;
    req.user = null;
  };

  next(); 
});

// Set up method override to work with POST requests that have the parameter "_method=DELETE"
app.use(methodOverride('_method'));

// ROUTES

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
	// Set variables for email, password
	var email = req.body.user.email;
	var password = req.body.user.password;
	// In db User, authenticate email & password entered into login form
	db.User
		.authenticate(email, password)
		// Then request to login as that user
		.then(function (user) {
			req.login(user);
			// Redirect to profile page
			res.redirect('/profile');
		});
});

// Route to profile page with saved location list
app.get('/profile', function(req, res) {
	// Request current User
	req.currentUser()
			// Then find all Locations for current User
			.then(function(user) {
				db.Location.findAll({
					where: {
						UserId : user.id
					}
				})
				// Then render profile page with user, userId, and locationsList
				.then(function(locations) {
					(res.render('users/profile', { user: user, locationsList: locations, userId: user.id }));
				});
			});
});

// // Route to list users
// app.get('/users', function(req, res) {
// 	res.render('users/index')
// });

// Route to new user
app.get('/signup', function(req, res) {
	var err = req.query.errors || false;
	console.log(err);

	if (err !== false) {
		res.render('site/signup', { err: err.split(":") });
	} else {
		res.render('site/signup', { err: false });
	}
});

// Route to create user via sign-up form
app.post('/users', function(req, res) {
	// Grab the user from the form
  var email = req.body.email;
  var password = req.body.password;
  // var zip = req.body.zip;

  // Create the new user
  db.User.
    createSecure(email, password, zip)
    	.then(function(result){
    		// res.redirect("/login");
    		if (result.hasErrored) {
    			console.log("I found these errors" + result.errors);
    			res.redirect('/signup?errors=' + result.errors.join(":"));
    		} else {
    			res.redirect("/login");
    		}
    	});
});

// // Route to show user
// app.get('/users/:id', function(req, res) {
// 	req.currentUser()
// 		.then(function (user) {
// 			res.render("profile", {user: user})
// 		})

// 	res.render('/users/id');
// })


// FIXME: Need to remember what this does
app.post('/users/:id', function(req, res) {
	// grab the user from the login page
	var email = req.body.email;
	var password = req.body.password;

	// check that the user exists in the db
	db.User.
		authenticate(email, password)
		.then(function(user){
			res.render('users/profile', { user: user });
		});

});

// // Route to edit user
// app.get('/users/:id/edit', function(req, res) {

// });

// // Route to update user - *PATCH*
// app.get('/users/:id', function(req, res) {

// });

// // Route to delete user - *DELETE*
// app.get('/users/:id', function(req, res) {

// });

// Route to logout user
app.delete('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
})

// Route to page to add new location
app.get('/locations/new', function(req, res) {
	res.render('locations/new');
});

// Route to add a new location
app.post('/locations', function(req, res) {
	// Create variable zipCode
	var zipCode = req.body.zip;
	// Log variable zipCode
	console.log(zipCode);
	// If zipCode is undefined or invalid, throw error
	if (!zipCode) {
		// throw new Error("Invalid zip code");
		// TODO: Need to add correct error handling here
	// Else call Open Weather Map API	
	} else {
		var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode;
		request(url, function(err, resp, body) {
			console.log("I'm in the API request")
			if (!err && resp.statusCode === 200) {
				console.log("I'm in the API request with no errors");
				var jsonData = JSON.parse(body);
				// if (!jsonData) {
				// 	res.redirect('/locations', {zips: [], noZips: true});
				// }
				// Create data in Locations db
				var lat = jsonData.coord.lat;
				var lon = jsonData.coord.lon;
				db.Location.create({ zip: zipCode, lat: lat, long: lon, UserId: req.session.UserId })
					.then(function(zip, lat, long) {
						// Redirect to locations
						res.redirect('/profile');
					});
			} else {
				console.log("I didn't make it");
			}
		});
	}
});

// Route to show location
app.get('/locations/:id', function(req, res) {
	// Set id variable
	var id = req.params.id;
	// Find location in the db by id
	db.Location.find(id)
		// Then call forecast.io API with that location's lat & long coords
		.then(function(id) {
			// Set url variable for API call
			var url = "https://api.forecast.io/forecast/" + env.MY_API_KEY + "/" + id.lat + "," + id.long;
			// Log API url
			console.log(url);
			// Call API
			request(url, function(err, resp, body) {
				// If no errors and response status code is 200
				if (!err && resp.statusCode === 200) {
					// Set variable result to the parsed JSON data
					var result = JSON.parse(body);
					// Render the individual location view passing the location id and result
					res.render('locations/location', { id: id, results: result });
				}
			});
			// FIXME: Double check if this is needed
			//res.render('locations/location', {id: id});
		});
	
});

// Route to list locations
app.get('/locations', function(req, res) {
	req.currentUser()
		.then(function(user) {
			db.Location.findAll({
				where: {
					UserId : user.id
				}
			})
			.then(function(locations) {
				(res.render('users/profile', {locationsList: locations, userId: user.id}));
			});
		});
});



// Route to create location
app.post('/locations', function(req, res) {

});

// Route to form to edit location
app.get('/locations/:id/edit', function(req, res) {
	var locationId = req.params.id;
	db.Location.find(locationId)
		.then(function(result) {
			res.render('locations/edit', { result: result, id: req.params.id });		
		});
});

// Route to update location - *PUT*
app.put('/locations/:id', function(req, res) {
	var locationId = req.params.id;
	var zip = req.body.zip;
	db.Location.find(locationId)
		.then(function(location) {
			location.updateAttributes({
				zip: zip })
			.then(function(savedLocation) {
				res.redirect('/locations/' + locationId);
			});
		});
});

// Route to delete location - *DELETE*
app.get('/locations/:id', function(req, res) {

});

// Start the server
var server = app.listen(process.env.PORT || 3000, function() {
// Snazzy listening message
	console.log(new Array(51).join("*"));
  console.log("\t LISTENING ON: \n\t\t localhost:3000");
  console.log(new Array(51).join("*")); 
 });