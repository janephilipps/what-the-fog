"use strict";
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes){
  var User = sequelize.define('User', {
    email: { 
      type: DataTypes.STRING, 
      unique: true,
      validate: {
        len: [6, 30]
      }
    },
    passwordDigest: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    zip: {
      type: DataTypes.STRING,
      validate: {
        len: [4,6]
      }
    }
  },

  {
    instanceMethods: {
      checkPassword: function(password) {
        return bcrypt.compareSync(password, this.passwordDigest);
      }
    },
    classMethods: {

      associate: function(models) {
        this.hasMany(models.Location);
      },

      encryptPassword: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function(email, password, zip) {
        var error = {};
        error.errors = [];
        error.hasErrored = false;

        // console.log("hi " + (typeof this.findAndCountAll( { where: { email: email } })));
        // If password is too short, throw error
        if(password.length < 6) {
          throw new Error("Password too short");
          error.errors.push(encodeURI("Your password is too short!"));
          error.hasErrored = true;
        } else {
          // Else, check if user already exists in db
          // Create variable for nested object User
          var _this = this
          // Return User db count where email is the same as email passed through function/entered into form
          return this.count( {where: { email: email } } )
            // Then run this function on userCount
            .then( function(userCount) {
              // Log count # in console
              console.log("count returned " + JSON.stringify(userCount));
              // Check if userCount is greater than 1 (aka check if email in db already)
              if (userCount >= 1) {
                // If true, throw error
                throw new Error("Email already exists");
                error.errors.push(encodedURI("Email already exists!"));
                error.hasErrored = true;
              } else {
                // Else, instantiate new User! (Hooray!)
                console.log("WERE GETTING HERE\n\n\n\n\n");
                return _this.create({
                  email: email,
                  passwordDigest: _this.encryptPassword(password),
                  zip: zip });
              }
            });
        }
      },
      authenticate: function(email, password) {
        // find a user in the DB
        return this.find({
          where: {
            email: email
          }
        }) 
        .then(function(user){
          if (user === null){
            throw new Error("Username does not exist");
          } else if (user.checkPassword(password)) {
            return user;
          } else {
            throw new Error("Invalid password");
          }

        });
      }

    } // close classMethods
  }); // close define user
  return User;
}; // close User function