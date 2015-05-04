"use strict";
module.exports = function (sequelize, DataTypes) {
  var Location = sequelize.define("Location", {
    zip: {
      type: DataTypes.STRING,
      validate: {
        len: [4,6],
      }
    },

    long: DataTypes.INTEGER,
    lat: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsTo(models.User);
      }
    }
  });
  return Location;
};