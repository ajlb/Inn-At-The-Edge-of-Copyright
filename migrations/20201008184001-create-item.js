'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      inventory: {
        type: Sequelize.BOOLEAN
      },
      inventorySize: {
        type: Sequelize.STRING
      },
      headSlot: {
        type: Sequelize.BOOLEAN
      },
      neckSlot: {
        type: Sequelize.BOOLEAN
      },
      torsoSlot: {
        type: Sequelize.BOOLEAN
      },
      rightHandSlot: {
        type: Sequelize.BOOLEAN
      },
      leftHandSlot: {
        type: Sequelize.BOOLEAN
      },
      legsSlot: {
        type: Sequelize.BOOLEAN
      },
      feetSlot: {
        type: Sequelize.BOOLEAN
      },
      ringSlot: {
        type: Sequelize.BOOLEAN
      },
      handsSlot: {
        type: Sequelize.BOOLEAN
      },
      twoHands: {
        type: Sequelize.BOOLEAN
      },
      edible: {
        type: Sequelize.BOOLEAN
      },
      healthEffect: {
        type: Sequelize.INTEGER
      },
      WISeffect: {
        type: Sequelize.INTEGER
      },
      STReffect: {
        type: Sequelize.INTEGER
      },
      DEXeffect: {
        type: Sequelize.INTEGER
      },
      HPeffect: {
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
    await queryInterface.dropTable('items');
  }
};