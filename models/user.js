'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
			type: DataTypes.STRING,
			unique: true
		},
    password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					args: [8, 25],
					msg: "Your password must be between 8 and 25 characters.  Please try again."
				}
			}
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
