"use strict";
var bcrypt = require("bcrypt");
var salt   = bcrypt.genSaltSync(10);

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
      checkPassword: function (password) {
        return bcrypt.compareSync(password, this.passwordDigest);
      }
    },

    classMethods: {

      associate: function (models) {
        this.hasMany(models.Location);
      },

      encryptPassword: function (password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function (email, password, zip) {
        var error = {};
        error.errors = [];
        error.hasErrored = false;
        // If password is too short, throw error
        if(password.length < 6) {
          // Push encodeURI error message into array errors in object error
          error.errors.push(encodeURI("Your password is too short!"));
          // Set err.hasErrored to true
          error.hasErrored = true;
          // Return a new Promise of error that has been resolved
          return Promise.resolve(error);
        } else {
          // Else, check if user already exists in db
          // Create variable for nested object User
          var _this = this
          // Return User db count where email is the same as email passed through function/entered into form
          return this.count( {where: { email: email } } )
            // Then run this function on userCount
            .then( function(userCount) {
              // Check if userCount is greater than 1 (aka check if email in db already)
              if (userCount >= 1) {
                // If true, throw error
                // Push encodeURI error message into array errors in object error
                error.errors.push(encodeURI("This email is already in use!"));
                // Set err.hasErrored to true
                error.hasErrored = true;
                // Return error aka Promise of error because error is already wrapped in a promise
                return error;
              } else {
                // Else, instantiate new User!
                return _this.create({
                  email: email,
                  passwordDigest: _this.encryptPassword(password),
                  zip: zip });
              }
            });
        }
      },
      authenticate: function (email, password) {
        // find a user in the DB
        return this.find({
          where: {
            email: email
          }
        })
        .then(function (user){
          if (user === null){
            throw new Error("Username does not exist");
          } else if (user.checkPassword(password)) {
            return user;
          } else {
            throw new Error("Invalid password");
          }

        });
      }

    }
  });
  return User;
};
