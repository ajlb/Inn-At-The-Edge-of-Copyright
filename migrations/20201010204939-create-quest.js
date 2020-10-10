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
        type: Sequelize.STRING(750)
      },
      dialogue: {
        type: Sequelize.TEXT
      },
      hints: {
        type: Sequelize.STRING(750)
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
      reward: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quests');
  }
};