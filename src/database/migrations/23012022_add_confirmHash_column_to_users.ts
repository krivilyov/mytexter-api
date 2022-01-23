'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'confirmHash', Sequelize.STRING),
      queryInterface.addColumn('users', 'isActive', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'confirmHash'),
      queryInterface.removeColumn('users', 'isActive'),
    ]);
  },
};
