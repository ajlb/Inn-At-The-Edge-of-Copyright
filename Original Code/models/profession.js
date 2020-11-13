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
    className: DataTypes.STRING(750),
    description: DataTypes.STRING(750),
    specialItem: DataTypes.INTEGER,
    level1Ability: DataTypes.STRING(750),
    level2Ability: DataTypes.STRING(750),
    level3Ability: DataTypes.STRING(750),
    level4Ability: DataTypes.STRING(750),
    level5Ability: DataTypes.STRING(750),
    level6Ability: DataTypes.STRING(750),
    level7Ability: DataTypes.STRING(750),
    level8Ability: DataTypes.STRING(750),
    level9Ability: DataTypes.STRING(750),
    level10Ability: DataTypes.STRING(750)
  }, {
    sequelize,
    modelName: 'profession',
    timestamps: false
  });
  return profession;
};