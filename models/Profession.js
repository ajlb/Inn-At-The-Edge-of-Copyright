const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const professionSchema = new Schema({
    className: {
        type: String,
        unique: true
    },
    description: {
        type: String,
    },
    specialItem: {
        type: String
    },
    level1Ability: {
        type: String
    },
    level2Ability: {
        type: String
    },
    level3Ability: {
        type: String
    },
    level4Ability: {
        type: String
    },
    level5Ability: {
        type: String
    },
    level6Ability: {
        type: String
    },
    level7Ability: {
        type: String
    },
    level8Ability: {
        type: String
    },
    level9Ability: {
        type: String
    },
    level10Ability: {
        type: String
    }
});

const Profession = mongoose.model("Profession", professionSchema);

module.exports = Profession;