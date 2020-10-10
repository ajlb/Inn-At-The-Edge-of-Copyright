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
    actionName: DataTypes.STRING(750),
    function: DataTypes.STRING(750),
    selfDescription: DataTypes.STRING(750),
    roomDescription: DataTypes.STRING(750),
    commandBriefDescription: DataTypes.STRING(750),
    commandLongDescription: DataTypes.STRING(750),
    waysToCall: DataTypes.STRING(750),
    exampleCall: DataTypes.STRING(750),
    exampleResult: DataTypes.STRING(750)
  }, {
    sequelize,
    modelName: 'action',
    timestamps: false
  });
  return action;
};