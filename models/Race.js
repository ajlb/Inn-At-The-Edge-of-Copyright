const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema({
    raceName: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    strengthBonus: {
        type: Number,
        default: 0
    },
    dexterityBonus: {
        type: Number,
        default: 0
    },
    wisdomBonus: {
        type: Number,
        default: 0
    },
    healthBonus: {
        type: Number,
        default: 0
    },
    specialAbility: {
        type: String
    }
});

const Race = mongoose.model("Race", raceSchema);

module.exports = Race;