'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  location.init({
    locationName: DataTypes.STRING(750),
    dayDescription: DataTypes.STRING(750),
    nightDescription: DataTypes.STRING(750),
    exitN: DataTypes.INTEGER,
    exitE: DataTypes.INTEGER,
    exitS: DataTypes.INTEGER,
    exitW: DataTypes.INTEGER,
    region: DataTypes.STRING(750),
    NPCs: DataTypes.STRING(750),
  }, {
    sequelize,
    modelName: 'location',
    timestamps: false
  });
  return location;
};