const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let locationSchema = new Schema({
  locationName: {
    type: String,
    trim: true,
    unique: true,
    required: "Character name is Required"
  },
  dayDescription: {
    type: String
  },
  nightDescription: {
    type: String
  },
  exits: {
    type: Array
  },
  region: {
    type: String
  },
  NPCs: {
    type: String
  },
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Inventory"
    }
  ],
  indoorOutdoor: {
    type: String
  }
});
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;