"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn(
    	'Locations',
    	'lat',
    	DataTypes.FLOAT
    	),
    migration.changeColumn(
    	'Locations',
    	'long',
    	DataTypes.FLOAT
    	)
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
