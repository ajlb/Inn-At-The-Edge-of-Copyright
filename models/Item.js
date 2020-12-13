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
    HPeffect: {
        type: Number,
        default: 0
    },
    WISeffect: {
        type: Number,
        default: 0
    },
    DEXeffect: {
        type: Number,
        default: 0
    },
    STReffect: {
        type: Number,
        default: 0
    },
    CHAeffect: {
        type: Number,
        default: 0
    },
    XPeffect: {
        type: Number,
        default: 0
    },
    equippable: [],
    
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
