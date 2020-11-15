const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let locationSchema = new Schema({
  locationName: {
    type: String
  },
  dayDescription: {
    type: String
  },
  nightDescription: {
    type: String
  },
  exits: {
    type: String
  },
  region: {
    type: String
  },
  NPCs: {
    type: String
  }
});
const Location = mongoose.model("Action", locationSchema);
module.exports = Location;