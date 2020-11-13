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
        type: Sequelize.STRING(750)
      },
      description: {
        type: Sequelize.STRING(750)
      },
      category: {
        type: Sequelize.STRING(750)
      },
      inventory: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      inventorySize: {
        type: Sequelize.STRING(750),
        defaultValue: 0
      },
      headSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      neckSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      torsoSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      rightHandSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      leftHandSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      legsSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      feetSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      ringSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      handsSlot: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      twoHands: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      edible: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      healthEffect: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      WISeffect: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      STReffect: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      DEXeffect: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      HPeffect: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('items');
  }
};