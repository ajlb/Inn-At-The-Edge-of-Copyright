const EJS = require('mongodb-extended-json');
const mongoose = require('mongoose');
const db = require('../../models');

//connect to mongoDB
mongoose.connect("mongodb://localhost:27017/innattheedge", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
const connection = mongoose.connection;

// log once mongoDB is open
connection.once("open", function () {
    console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
});

const parsedPlayerObject = EJS.deserialize(require('./seeds/playersSeed'));

db.Player.insertMany(parsedPlayerObject);

const parsedActionsObject = EJS.deserialize(require('./seeds/actionsSeed'));

db.Action.insertMany(parsedActionsObject);

const parsedLocationsArray = EJS.deserialize(require('./seeds/locationsSeed'));

db.Location.insertMany(parsedLocationsArray);

const parsedItemArray = EJS.deserialize(require('./seeds/itemsSeed'));

db.Item.insertMany(parsedItemArray);

const parsedProfessionArray = EJS.deserialize(require('./seeds/professionsSeed'));

db.Profession.insertMany(parsedProfessionArray);

const parsedQuestArray = EJS.deserialize(require('./seeds/questsSeed'));

db.Quest.insertMany(parsedQuestArray);

const parsedRaceArray = EJS.deserialize(require('./seeds/racesSeed'));

db.Race.insertMany(parsedRaceArray);

const parsedWeatherArray = EJS.deserialize(require('./seeds/weatherSeed'));

db.Weather.insertMany(parsedWeatherArray);