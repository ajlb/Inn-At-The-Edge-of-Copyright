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
        type: Sequelize.STRING
      },
      dayDescription: {
        type: Sequelize.STRING
      },
      nightDescription: {
        type: Sequelize.STRING
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
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('locations');
  }
};