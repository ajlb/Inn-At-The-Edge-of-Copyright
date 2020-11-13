'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      locationName: {
        type: Sequelize.STRING(750)
      },
      dayDescription: {
        type: Sequelize.STRING(750)
      },
      nightDescription: {
        type: Sequelize.STRING(750)
      },
      exitN: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      exitE: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      exitS: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      exitW: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      region: {
        type: Sequelize.STRING(750)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('locations');
  }
};