'use strict';
const bcrypt = require("bcryptjs");
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
    email: DataTypes.STRING(750),
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    characterName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    XP: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isLiving: DataTypes.BOOLEAN,
    isNPC: DataTypes.BOOLEAN,
    WIS: DataTypes.DECIMAL(5,2),
    DEX: DataTypes.DECIMAL(5,2),
    STR: DataTypes.DECIMAL(5,2),
    HP: DataTypes.INTEGER,
    race: DataTypes.STRING(750),
    class: DataTypes.STRING(750),
    abilities: DataTypes.STRING(750),
    inventory: DataTypes.INTEGER,
    lastLocation: {
      type:DataTypes.INTEGER,
      defaultValue: 1003
    },
    backstory: DataTypes.STRING(750),
    description: DataTypes.STRING(750),
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

  player.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  player.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return player;
};