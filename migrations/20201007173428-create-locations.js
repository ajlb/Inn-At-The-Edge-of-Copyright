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
        type: Sequelize.INTEGER
      },
      exitE: {
        type: Sequelize.INTEGER
      },
      exitS: {
        type: Sequelize.INTEGER
      },
      exitW: {
        type: Sequelize.INTEGER
      },
      region: {
        type: Sequelize.STRING
      }
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
    await queryInterface.dropTable('locations');
  }
};