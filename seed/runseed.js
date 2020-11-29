const EJS = require('mongodb-extended-json');
const mongoose = require('mongoose');
const db = require('../models');

let success = true;

function replaceOne(Model, seedObj) {
    Model.findOneAndReplace
        ({ _id: seedObj._id }, seedObj, { upsert: true, runValidators: true, returnNewDocument: true, new: true }, (err, returnData) => {
            if (err) {
                success = false;
                throw err;
            };
        })
}

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

    const parsedPlayerArray = EJS.deserialize(require('./seeds/playersSeed'));

    parsedPlayerArray.forEach(playerObj => replaceOne(db.Player, playerObj))

    const parsedActionsArray = EJS.deserialize(require('./seeds/actionsSeed'));

    parsedActionsArray.forEach(actionObj => replaceOne(db.Action, actionObj));

    const parsedLocationsArray = EJS.deserialize(require('./seeds/locationsSeed'));

    parsedLocationsArray.forEach(locationObj => replaceOne(db.Location, locationObj));

    const parsedItemArray = EJS.deserialize(require('./seeds/itemsSeed'));

    parsedItemArray.forEach(itemObj => replaceOne(db.Item, itemObj));

    const parsedProfessionArray = EJS.deserialize(require('./seeds/professionsSeed'));

    parsedProfessionArray.forEach(professionObj => replaceOne(db.Profession, professionObj));

    const parsedQuestArray = EJS.deserialize(require('./seeds/questsSeed'));

    parsedQuestArray.forEach(questObj => replaceOne(db.Quest, questObj));

    const parsedRaceArray = EJS.deserialize(require('./seeds/racesSeed'));

    parsedRaceArray.forEach(raceObj => replaceOne(db.Race, raceObj));

    const parsedWeatherArray = EJS.deserialize(require('./seeds/weatherSeed'));

    parsedWeatherArray.forEach(weatherObj => replaceOne(db.Weather, weatherObj));

    if (success) {
        // right now this logs no matter what because of asynchronous database setters but it gets lost in giant error logs if errors are logged so leave it until a better fix is found(like making all the functions asynchronous and using await )
        console.log('Success! Local Database updated! Enter ctrl + C to exit')
    }
});