'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Items', 'context_id');
    queryInterface.removeColumn('Contexts', 'user_id');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Items', 'context_id', Sequelize.INTEGER);
    queryInterface.addColumn('Contexts', 'user_id', Sequelize.INTEGER);
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
