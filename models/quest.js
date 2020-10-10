'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class quest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  quest.init({
    questTitle: DataTypes.STRING,
    dialogue: DataTypes.TEXT,
    hints: DataTypes.STRING,
    XPorItem: DataTypes.BOOLEAN,
    completionItem: DataTypes.INTEGER,
    questToken: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'quest',
  });
  return quest;
};