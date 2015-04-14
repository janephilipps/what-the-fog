"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameColumn(
    	'Locations',
    	'user_id',
    	'UserId'
    	),
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
