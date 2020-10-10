'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questTitle: {
        type: Sequelize.STRING
      },
      dialogue: {
        type: Sequelize.TEXT
      },
      hints: {
        type: Sequelize.STRING
      },
      XPorItem: {
        type: Sequelize.BOOLEAN
      },
      completionItem: {
        type: Sequelize.INTEGER
      },
      questToken: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('quests');
  }
};