'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'userLang', {
        type: Sequelize.INTEGER,
        defaultValue: 3,
      }),
      queryInterface.addColumn('users', 'learningLang', {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'userLang'),
      queryInterface.removeColumn('users', 'learningLang'),
    ]);
  },
};
