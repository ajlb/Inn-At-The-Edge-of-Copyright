'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  player.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    characterName: DataTypes.STRING,
    isLiving: DataTypes.BOOLEAN,
    isNPC: DataTypes.BOOLEAN,
    WIS: DataTypes.INTEGER,
    DEX: DataTypes.INTEGER,
    STR: DataTypes.INTEGER,
    HP: DataTypes.INTEGER,
    race: DataTypes.STRING,
    class: DataTypes.STRING,
    abilities: DataTypes.STRING,
    inventory: DataTypes.INTEGER,
    backstory: DataTypes.STRING,
    description: DataTypes.STRING,
    headSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    neckSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    torsoSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    rightHandSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    leftHandSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    legsSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    feetSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    ringSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    handsSlot: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    twoHands: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'player',
    timestamps: false
  });
  return player;
};