'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      inventory.belongsTo(models.item)
    }
  };
  inventory.init({
    locator_id: DataTypes.STRING,
    itemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    currentlyEquipped: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'inventory',
    timestamps: false
  });
  return inventory;
};