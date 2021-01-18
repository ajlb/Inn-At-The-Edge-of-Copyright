//used in quest model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dialogSchema = new Schema({
    NPC: {
        type: String
    },
    messages: {
        type: Array
    }
});

const Dialog = mongoose.model("Dialog", dialogSchema);
module.exports = Dialog;