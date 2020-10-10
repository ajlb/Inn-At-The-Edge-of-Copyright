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
    headSlot: DataTypes.INTEGER,
    neckSlot: DataTypes.INTEGER,
    torsoSlot: DataTypes.INTEGER,
    rightHandSlot: DataTypes.INTEGER,
    rightHandSlot: DataTypes.INTEGER,
    leftHandSlot: DataTypes.INTEGER,
    legsSlot: DataTypes.INTEGER,
    feetSlot: DataTypes.INTEGER,
    ringSlot: DataTypes.INTEGER,
    handsSlot: DataTypes.INTEGER,
    twoHands: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'player',
  });
  return player;
};