'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('professions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      className: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      specialItem: {
        type: Sequelize.INTEGER
      },
      level1Ability: {
        type: Sequelize.STRING
      },
      level2Ability: {
        type: Sequelize.STRING
      },
      level3Ability: {
        type: Sequelize.STRING
      },
      level4Ability: {
        type: Sequelize.STRING
      },
      level5Ability: {
        type: Sequelize.STRING
      },
      level6Ability: {
        type: Sequelize.STRING
      },
      level7Ability: {
        type: Sequelize.STRING
      },
      level8Ability: {
        type: Sequelize.STRING
      },
      level9Ability: {
        type: Sequelize.STRING
      },
      level10Ability: {
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
    await queryInterface.dropTable('professions');
  }
};