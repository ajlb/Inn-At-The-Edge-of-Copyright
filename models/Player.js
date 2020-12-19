const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  characterName: {
    type: String,
    unique: true,
    trim: true,
    required: "Character name is Required"
  },
  characterNameLowerCase: {
    type: String,
    unique: true,
    trim: true,
    required: "Character name lower case is Required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    validate: [({ length }) => length >= 6, "Password should be longer."]
  },
  email: {
    type: String,
    // unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  isLiving: {
    type: Boolean,
    default: true
  },
  isAwake: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  isNPC: {
    type: Boolean,
    default: false
  },
  stats:
  {
    WIS: {
      type: Number,
      default: 0
    },
    DEX: {
      type: Number,
      default: 0
    },
    STR: {
      type: Number,
      default: 0
    },
    HP: {
      type: Number,
      default: 0
    },
    CHA: {
      type: Number,
      default: 0
    },
    maxWIS: {
      type: Number,
      default: 0
    },
    maxDEX: {
      type: Number,
      default: 0
    },
    maxCHA: {
      type: Number,
      default: 0
    },
    maxSTR: {
      type: Number,
      default: 0
    },
    maxHP: {
      type: Number,
      default: 0
    },
    XP: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    }
  },
  race: {
    type: String,
    default: "Human"
  },
  profession: {
    type: String,
    default: "Sandwich Maker"
  },
  abilities: {
    type: String
  },
  inventory: [{
    item: {type: Schema.Types.ObjectId, ref: "Item"},
    quantity: Number,
    dropTime: Array
  }]
  ,
  lastLocation: {
    type: String
  },
  backstory: {
    type: String
  },
  description: {
    type: String
  },
  wornItems:
    {
      headSlot: {
        type: String
      },
      neckSlot: {
        type: String
      },
      torsoSlot: {
        type: String
      },
      rightHandSlot: {
        type: String
      },
      leftHandSlot: {
        type: String
      },
      legsSlot: {
        type: String
      },
      feetSlot: {
        type: String
      },
      fingerSlot: {
        type: String
      },
      handsSlot: {
        type: String
      },
      twoHands: {
        type: String
      }
    },
  day: {
    type: Boolean
  }
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
