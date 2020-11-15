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
        type: String
    },
    edible: {
        type: Boolean,
        default: 0
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
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
