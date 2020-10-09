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
        type: Sequelize.STRING
      },
      function: {
        type: Sequelize.STRING
      },
      selfDescription: {
        type: Sequelize.STRING
      },
      roomDescription: {
        type: Sequelize.STRING
      },
      commandBriefDescription: {
        type: Sequelize.STRING
      },
      commandLongDescription: {
        type: Sequelize.STRING
      },
      waysToCall: {
        type: Sequelize.STRING
      },
      exampleCall: {
        type: Sequelize.STRING
      },
      exampleResult: {
        type: Sequelize.STRING
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('actions');
  }
};