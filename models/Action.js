const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Action = new Schema({
  actionName: {
    type: String
  },
  commandBriefDescription: {
    type: String
  },
  commandLongDescription: {
    type: String
  },
  waysToCall: {
    type: String
  },
  exampleCall: {
    type: String
  },
  exampleResult: {
    type: String
  }
});

module.exports = mongoose.model("Action", Action);