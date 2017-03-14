'use strict';
module.exports = function(sequelize, DataTypes) {
  var ConnectSession = sequelize.define('ConnectSession', {
    sid: {
			type: DataTypes.STRING,
			primaryKey: true
		},
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ConnectSession;
};
