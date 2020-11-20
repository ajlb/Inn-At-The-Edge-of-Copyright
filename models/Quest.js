const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questSchema = new Schema({
    questTitle: {
        type: String,
        unique: true
    },
    dialog: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dialog"
        }
    ],
    hints: {
        type: String
    },
    rewardXP: {
        type: Number,
        default: 0
    },
    rewardItem: {
        type: String
    },
    questToken: {
        type: String
    },
    completionItem: {
        type: String
    }
});

const Quest = mongoose.model("Quest", questSchema);

module.exports = Quest;