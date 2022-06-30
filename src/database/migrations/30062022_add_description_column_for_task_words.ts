'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'task-words',
      'description',
      Sequelize.TEXT,
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('task-words', 'description');
  },
};
