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
    type: Object
  },
  region: {
    type: String
  },
  NPCs: {
    type: Array
  },
  inventory: 
    [{
    item: {type: Schema.Types.ObjectId, ref: "Item"},
    quantity: Number
    } ]
  ,
  discoverables: {
    type: Array,
    default: undefined
  },
  indoorOutdoor: {
    type: String
  }
});
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;