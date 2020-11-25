const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let actionSchema = new Schema({
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
}, {capped: 1024});
const Action = mongoose.model("Action", actionSchema);
module.exports = Action;