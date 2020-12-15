const db = require("../models");
const locationSeed = require("../scripts/seed/4-locations/locations.json");
const { findLocationData } = require("./userInput/move");



function repopLocation(index, location){
    return new Promise(function(resolve, reject){
        const realFightables = location.fightables;
        const seedFightables = locationSeed[index].fightables;
        console.log(realFightables);
        console.log(locationFightables);
    });
}











function repopMobs(io, socket){
    try {
        console.log("inside repopMobs");
        db.Location.find({}).then(allLocations => {
            for (const index in allLocations){
                const location = allLocations[index];
                repopLocation(index, location).then(changeDetected => {
                    console.log(changeDetected);

                });
            }
        }).catch(e=>console.log(e));
    
    } catch (e) {
        console.log("ERROR FROM repopMobs(monsterSweeper.js):");
        console.log(e);
    }
}


module.exports = {
    repopMobs
}
