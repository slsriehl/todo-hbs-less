'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Contexts', 'user_id', Sequelize.INTEGER);
    queryInterface.removeColumn('Items', 'user_id');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Items', 'user_id', Sequelize.INTEGER);
    queryInterface.removeColumn('Contexts', 'user_id');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
