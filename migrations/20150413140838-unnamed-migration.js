"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn(
    	'Users',
    	'zip',
    	DataTypes.STRING
    	)
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
