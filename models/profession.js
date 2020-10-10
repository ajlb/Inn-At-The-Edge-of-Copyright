'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  profession.init({
    className: DataTypes.STRING,
    description: DataTypes.STRING,
    specialItem: DataTypes.INTEGER,
    level1Ability: DataTypes.STRING,
    level2Ability: DataTypes.STRING,
    level3Ability: DataTypes.STRING,
    level4Ability: DataTypes.STRING,
    level5Ability: DataTypes.STRING,
    level6Ability: DataTypes.STRING,
    level7Ability: DataTypes.STRING,
    level8Ability: DataTypes.STRING,
    level9Ability: DataTypes.STRING,
    level10Ability: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profession',
  });
  return profession;
};