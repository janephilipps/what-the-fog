"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn(
    	'Locations',
    	'user_id',
    	DataTypes.INTEGER
    	)
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
