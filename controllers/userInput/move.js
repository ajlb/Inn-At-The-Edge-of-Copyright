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


const move = (socket, io, previousLocation, newLocation, direction, user) => {
    if (["north", "east", "south", "west"].indexOf(direction) !== -1) {
        io.to(previousLocation).emit('move', { actor: user, direction, cardinal: true, action: "leave" });
    } else {
        io.to(previousLocation).emit('move', { actor: user, direction, cardinal: false, action: "leave" });
    }

    io.to(socket.id).emit('yourMove', direction);

    if (["north", "east", "south", "west"].indexOf(direction) !== -1) {
        const switchDirections = { north: "south", east: "west", south: "north", west: "east" };
        direction = switchDirections[direction];
        io.to(newLocation).emit('move', { actor: user, direction, cardinal: true, action: "arrive" });
    } else {
        io.to(newLocation).emit('move', { actor: user, direction, cardinal: false, action: "arrive" });
    }
    rememberLocation(user, newLocation);
    //find locations, return chunk
    findLocationData(newLocation).then(currentLocationData => {

        resolveLocationChunk(currentLocationData).then(chunk => {
            io.to(socket.id).emit('locationChunk', chunk);
            location = chunk;
        });

    })
}

module.exports = {
    resolveLocationChunk,
    rememberLocation,
    findLocationData,
    move
}