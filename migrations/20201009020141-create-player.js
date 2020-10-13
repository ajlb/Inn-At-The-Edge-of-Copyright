'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(750)
      },
      password: {
        type: Sequelize.STRING(750)
      },
      characterName: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      XP: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isLiving: {
        type: Sequelize.BOOLEAN
      },
      isNPC: {
        type: Sequelize.BOOLEAN
      },
      WIS: {
        type: Sequelize.DECIMAL(5,2)
      },
      DEX: {
        type: Sequelize.DECIMAL(5,2)
      },
      STR: {
        type: Sequelize.DECIMAL(5,2)
      },
      HP: {
        type: Sequelize.INTEGER
      },
      race: {
        type: Sequelize.STRING(750)
      },
      class: {
        type: Sequelize.STRING(750)
      },
      abilities: {
        type: Sequelize.STRING(750)
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      backstory: {
        type: Sequelize.STRING(750)
      },
      description: {
        type: Sequelize.STRING(750)
      },
      headSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      neckSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      torsoSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rightHandSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rightHandSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      leftHandSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      legsSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      feetSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      ringSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      handsSlot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      twoHands: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('players');
  }
};