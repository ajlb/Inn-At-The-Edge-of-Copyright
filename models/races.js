'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class races extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  races.init({
    raceName: DataTypes.STRING(750),
    description: DataTypes.STRING(750),
    STRbonus: DataTypes.INTEGER,
    DEXbonus: DataTypes.INTEGER,
    WISbonus: DataTypes.INTEGER,
    HPbonus: DataTypes.INTEGER,
    specialAbility: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'races',
    timestamps: false,
  });
  return races;
};