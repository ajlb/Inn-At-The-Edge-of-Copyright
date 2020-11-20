// used in inventory model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    inventorySize: {
        type: Number
    },
    edible: {
        type: Boolean,
        default: false
    },
    healthEffect: {
        type: Number,
        default: 0
    },
    wisdomEffect: {
        type: Number,
        default: 0
    },
    dexterityEffect: {
        type: Number,
        default: 0
    },
    strengthEffect: {
        type: Number,
        default: 0
    },
    xpEffect: {
        type: Number,
        default: 0
    },
    equippable: []
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
