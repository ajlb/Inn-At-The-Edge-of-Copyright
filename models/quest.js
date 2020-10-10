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
    questTitle: DataTypes.STRING(750),
    dialogue: DataTypes.TEXT,
    hints: DataTypes.STRING(750),
    XPorItem: DataTypes.BOOLEAN,
    completionItem: DataTypes.INTEGER,
    questToken: DataTypes.INTEGER,
    reward: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'quest',
    timestamps: false
  });
  return quest;
};