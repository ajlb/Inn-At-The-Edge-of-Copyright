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
    locationName: DataTypes.STRING,
    locationDayDescription: DataTypes.STRING,
    locationNightDescription: DataTypes.STRING,
    exitN: DataTypes.INTEGER,
    exitE: DataTypes.INTEGER,
    exitS: DataTypes.INTEGER,
    exitW: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'location',
  });
  return location;
};