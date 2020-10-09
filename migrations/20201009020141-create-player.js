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
        type: Sequelize.INTEGER
      },
      neckSlot: {
        type: Sequelize.INTEGER
      },
      torsoSlot: {
        type: Sequelize.INTEGER
      },
      rightHandSlot: {
        type: Sequelize.INTEGER
      },
      rightHandSlot: {
        type: Sequelize.INTEGER
      },
      leftHandSlot: {
        type: Sequelize.INTEGER
      },
      legsSlot: {
        type: Sequelize.INTEGER
      },
      feetSlot: {
        type: Sequelize.INTEGER
      },
      ringSlot: {
        type: Sequelize.INTEGER
      },
      handsSlot: {
        type: Sequelize.INTEGER
      },
      twoHands: {
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
    await queryInterface.dropTable('players');
  }
};