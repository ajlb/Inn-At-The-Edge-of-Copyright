'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('weather', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      weatherCondition: {
        type: Sequelize.STRING(750)
      },
      dayDescription: {
        type: Sequelize.STRING(750)
      },
      nightDescription: {
        type: Sequelize.STRING(750)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('weather');
  }
};