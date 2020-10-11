'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weather extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  weather.init({
    weatherCondition: DataTypes.STRING(750),
    dayDescription: DataTypes.STRING(750),
    nightDescription: DataTypes.STRING(750)
  }, {
    sequelize,
    modelName: 'weather',
    timestamps: false,
  });
  return weather;
};