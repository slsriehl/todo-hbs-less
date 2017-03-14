'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
			type: DataTypes.STRING,
			unique: true
		},
    password: {
			type: DataTypes.STRING,
			allowNull: false
		},
  }, {
    classMethods: {
      associate: function(models) {
				User.hasMany(models.Item)
        // associations can be defined here
      }
    }
  });
  return User;
};
