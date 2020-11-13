'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('races', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      raceName: {
        type: Sequelize.STRING(750)
      },
      description: {
        type: Sequelize.STRING(750)
      },
      STRbonus: {
        type: Sequelize.INTEGER
      },
      DEXbonus: {
        type: Sequelize.INTEGER
      },
      WISbonus: {
        type: Sequelize.INTEGER
      },
      HPbonus: {
        type: Sequelize.INTEGER
      },
      specialAbility: {
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
    await queryInterface.dropTable('races');
  }
};