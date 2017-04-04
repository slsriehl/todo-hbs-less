'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		return queryInterface.createTable('Items', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [3, 50],
						msg: "Your to-do item name must be between 3 and 50 characters.  Please try again."
					}
				}
			},
			description: {
				type: Sequelize.TEXT,
				validate: {
					len: {
						args: [5, 150],
						msg: "Your description must be between 5 and 150 characters.  Please try again."
					}
				}
			},
			done: {
				type: Sequelize.BOOLEAN
			},
			ContextId: {
				type: Sequelize.UUID
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
		return queryInterface.dropTable('Items');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
