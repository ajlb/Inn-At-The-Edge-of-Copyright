const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const objectiveSchema = new Schema({
    reference: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rewardXP: {
        type: Number,
        default: 0,
        required: true
    },
    token: {
        type: String
    },
    last: {
        type: Boolean,
        default: false
    }
})

const questSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    objectives: [objectiveSchema],
    completionItem: {
        type: String
    }
});

const Quest = mongoose.model("Quest", questSchema);

module.exports = Quest;