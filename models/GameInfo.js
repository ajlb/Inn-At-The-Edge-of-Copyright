const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let gameInfoSchema = new Schema({
    version: {
        type: String
    },
    dayNight: {
        type: String
    }
});
const GameInfo = mongoose.model("GameInfo", gameInfoSchema);
module.exports = GameInfo;