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
        type: Sequelize.STRING(750)
      },
      description: {
        type: Sequelize.STRING(750)
      },
      specialItem: {
        type: Sequelize.INTEGER
      },
      level1Ability: {
        type: Sequelize.STRING(750)
      },
      level2Ability: {
        type: Sequelize.STRING(750)
      },
      level3Ability: {
        type: Sequelize.STRING(750)
      },
      level4Ability: {
        type: Sequelize.STRING(750)
      },
      level5Ability: {
        type: Sequelize.STRING(750)
      },
      level6Ability: {
        type: Sequelize.STRING(750)
      },
      level7Ability: {
        type: Sequelize.STRING(750)
      },
      level8Ability: {
        type: Sequelize.STRING(750)
      },
      level9Ability: {
        type: Sequelize.STRING(750)
      },
      level10Ability: {
        type: Sequelize.STRING(750)
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