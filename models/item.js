'use strict';
module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
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
				Item.belongsTo(models.Context, {foreignKey: 'ContextId', onDelete: 'CASCADE'});
				//Item.hasOne(models.Context, {foreignKey: 'ContextId', onDelete: 'CASCADE'});
        // associations can be defined here
      }
    }
  });
  return Item;
};
