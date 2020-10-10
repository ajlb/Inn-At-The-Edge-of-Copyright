'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  action.init({
    actionName: DataTypes.STRING,
    function: DataTypes.STRING,
    selfDescription: DataTypes.STRING,
    roomDescription: DataTypes.STRING,
    commandBriefDescription: DataTypes.STRING,
    commandLongDescription: DataTypes.STRING,
    waysToCall: DataTypes.STRING,
    exampleCall: DataTypes.STRING,
    exampleResult: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'action',
    timestamps: false
  });
  return action;
};