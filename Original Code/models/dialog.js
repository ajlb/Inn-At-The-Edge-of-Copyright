'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class dialog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    };
    dialog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        NPC: DataTypes.STRING(250),
        dialogObj: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'dialog',
        timestamps: false,
        freezeTableName: true
    });
    return dialog;
};