// used in player and locations models
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    item: [
        {
            type: Schema.Types.ObjectId,
            ref: "Item"
        }
    ],
    quantity: {
        type: Number
    },
    
}, { capped: 1024});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;