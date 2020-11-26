const EJS = require('mongodb-extended-json');
const mongoose = require('mongoose');
const db = require('./models');

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/innattheedge", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
const connection = mongoose.connection;

// log once mongoDB is open
connection.once("open", function () {
    console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
});

// const parsedPlayerObject = EJS.deserialize(require('./players_collection'));

// db.Player.insertMany(parsedPlayerObject);

// const parsedActionsObject = EJS.deserialize(require('./actions_collection'));

// db.Action.insertMany(parsedActionsObject);

// Ran into issues with inventory type of objectID
// const parsedLocationsArray = EJS.deserialize(require('./locations'));

// db.Location.insertMany(parsedLocationsArray);

// const parsedItemArray = EJS.deserialize(require('./items_collection'));

// db.Item.insertMany(parsedItemArray);

// const parsedProfessionArray = EJS.deserialize(require('./professions_collection.js'));

// db.Profession.insertMany(parsedProfessionArray);

// const parsedQuestArray = EJS.deserialize(require('./quests_collection.js'));

// db.Quest.insertMany(parsedQuestArray);

// const parsedRaceArray = EJS.deserialize(require('./races.js'));

// db.Race.insertMany(parsedRaceArray);

// const parsedWeatherArray = EJS.deserialize(require('./weather_collection'));

// db.Weather.insertMany(parsedWeatherArray);