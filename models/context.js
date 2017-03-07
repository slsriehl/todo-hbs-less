'use strict';
module.exports = function(sequelize, DataTypes) {
  var Context = sequelize.define('Context', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
				Context.hasMany(models.Item)
        // associations can be defined here
      }
    }
  });
  return Context;
};
