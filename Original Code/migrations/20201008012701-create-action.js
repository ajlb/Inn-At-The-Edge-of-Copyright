'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('actions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actionName: {
        type: Sequelize.STRING(750)
      },
      commandBriefDescription: {
        type: Sequelize.STRING(750)
      },
      commandLongDescription: {
        type: Sequelize.STRING(750)
      },
      waysToCall: {
        type: Sequelize.STRING(750)
      },
      exampleCall: {
        type: Sequelize.STRING(750)
      },
      exampleResult: {
        type: Sequelize.STRING(750)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('actions');
  }
};