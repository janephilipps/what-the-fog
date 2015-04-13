"use strict";
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes){
  var User = sequelize.define('User', {
    email: { 
      type: DataTypes.STRING, 
      unique: true,
      validate: {
        len: [6, 30],
      }
    },
    passwordDigest: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      validate: {
        len: [5],
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
        // If password is too short, throw error
        if(password.length < 6) {
          throw new Error("Password too short");
        // If username already exists in db, throw new error
        } else if (email === this.find( { where: {email: email} } )) {
          throw new Error("User already created");
        }
        return this.create({
          email: email,
          passwordDigest: this.encryptPassword(password),
          zip: zip
        });

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