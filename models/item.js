'use strict';
module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    context_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					args: [3, 50],
					msg: "Your to-do item name must be between 3 and 50 characters.  Please try again."
				}
			}
		},
		done: DataTypes.BOOLEAN,
    description: {
			type: DataTypes.TEXT,
			validate: {
				len: {
					args: [5, 150],
					msg: "Your description must be between 5 and 150 characters.  Please try again."
				}
			}
		}
  }, {
    classMethods: {
      associate: function(models) {
				Item.belongsTo(models.User, {foreignKey: Item.user_id, onDelete: 'CASCADE'});
				Item.belongsTo(models.Context, {foreignKey: Item.context_id, onDelete: 'CASCADE'});
        // associations can be defined here
      }
    }
  });
  return Item;
};
