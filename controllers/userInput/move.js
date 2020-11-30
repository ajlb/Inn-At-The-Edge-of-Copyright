const db = require("../../models");
const mongoose = require("mongoose");

//this pair of functions is for returning async location data within the socket response
const getLocationChunk = async (data) => {
    let locationObject = {};
    locationObject.current = data;
    for (const exit in data.exits) {
        const thisLocation = data.exits[exit];
        locationObject[exit] = await db.Location.findOne({ locationName: thisLocation });
    }
    return locationObject;
}
const resolveLocationChunk = (data) => {
    return new Promise((resolve, reject) => {
        resolve(getLocationChunk(data));
    })
}

const rememberLocation = (username, newLocation) => {
    return new Promise((resolve, reject) => {
        db.Player.updateOne({ characterName: username }, { $set: { lastLocation: newLocation } }).then(returnData=>{
            resolve(returnData);
        });
    });
}

const findLocationData = (locationName) => {
    return new Promise((resolve, reject)=>{
        db.Location.findOne({ locationName: locationName }).then(returnData=>{
            resolve(returnData);
        });
    });
}

module.exports = {
    resolveLocationChunk,
    rememberLocation,
    findLocationData
}