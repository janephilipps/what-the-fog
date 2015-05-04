"use strict";
module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable("Locations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      zip: {
        type: DataTypes.INTEGER
      },
      long: {
        type: DataTypes.INTEGER
      },
      lat: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function (migration, DataTypes, done) {
    migration.dropTable("Locations").done(done);
  }
};