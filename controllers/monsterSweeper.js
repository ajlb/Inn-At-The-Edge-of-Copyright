const db = require("../models");
const locationSeed = require("../scripts/seed/4-locations/locations.json");
const { updateAndDisseminateFightables, insertArticleSingleValue } = require("./fighting");


function repopLocation(io, socket, index, location) {
    return new Promise(function (resolve, reject) {

        const realFightables = location.fightables;
        const seedFightables = locationSeed[index].fightables;
        if (seedFightables && seedFightables.length > 0) {
            for (const monsterIndex in seedFightables) {
                if ((seedFightables[monsterIndex].isAlive === true) && (realFightables[monsterIndex].isAlive === false)) {
                    let monster = seedFightables[monsterIndex];
                    updateAndDisseminateFightables({ io, singleLocationChunk: location, monsterObject: monster, isAlive: true, isFighting: false });
                    // console.log(location.locationName);
                }
            }

        }
    });
}


function repopMobs(io, socket) {
    try {
        console.log("running repop mobs");
        db.Location.find({}).then(allLocations => {
            for (const index in allLocations) {
                const location = allLocations[index];
                repopLocation(io, socket, index, location);
            }
        }).catch(e => console.log(e));

    } catch (e) {
        console.log("ERROR FROM repopMobs(monsterSweeper.js):");
        console.log(e);
    }
}


module.exports = {
    repopMobs
}
