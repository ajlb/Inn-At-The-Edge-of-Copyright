const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    weatherCondition: {
        type: String,
        unique: true
    },
    dayDescription: {
        type: String
    },
    nightDescription: {
        type: String
    },
    healthImpact: {
        type: Number,
        default: 0
    }
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;