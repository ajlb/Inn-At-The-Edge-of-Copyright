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
    weatherCondition: DataTypes.STRING,
    dayDescription: DataTypes.STRING,
    nightDescription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'weather',
    timestamps: false,
  });
  return weather;
};