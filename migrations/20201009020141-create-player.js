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
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      characterName: {
        type: Sequelize.STRING
      },
      isLiving: {
        type: Sequelize.BOOLEAN
      },
      isNPC: {
        type: Sequelize.BOOLEAN
      },
      WIS: {
        type: Sequelize.INTEGER
      },
      DEX: {
        type: Sequelize.INTEGER
      },
      STR: {
        type: Sequelize.INTEGER
      },
      HP: {
        type: Sequelize.INTEGER
      },
      race: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      abilities: {
        type: Sequelize.STRING
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      backstory: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
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