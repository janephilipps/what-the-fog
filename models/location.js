"use strict";
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define("Location", {
    zip: {
      type: DataTypes.INTEGER,
      validate: {
        len: [5],
      }
    },
    
    long: DataTypes.INTEGER,
    lat: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User);
      }
    }
  });
  return Location;
};