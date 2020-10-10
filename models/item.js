'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
    class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      item.hasMany(models.inventory, {as: "Stuff"})
    }
  };
  item.init({
    itemName: {
      type: DataTypes.STRING,
    },      
    description: {
      type: DataTypes.STRING,
    },      
      category: {
      type: DataTypes.STRING,
    },      
      inventory: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    inventorySize: {
      type: DataTypes.STRING,
    },
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
    edible: {
      type: DataTypes.BOOLEAN,
      DefaultValue: 0,
    },
    healthEffect:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    WISeffect: {
      type: DataTypes.INTEGER,
      DefaultValue: 0,
    },
    STReffect: {
      type: DataTypes.INTEGER,
      DefaultValue: 0,
    },
    DEXeffect: {
      type: DataTypes.INTEGER,
      DefaultValue: 0,
    },
    HPeffect: {
      type: DataTypes.INTEGER,
      DefaultValue: 0,
    }
    }, {
    sequelize,
    modelName: 'item',
    timestamps: false
  });
  return item;
};