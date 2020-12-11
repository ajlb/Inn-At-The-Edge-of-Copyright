const db = require("../../models");
const mongoose = require("mongoose");

//this pair of functions is for returning async location data within the socket response
const getLocationChunk = async (data) => {
    let locationObject = {};
    locationObject.current = data;
    for (const exit in data.exits) {
        const thisLocation = data.exits[exit];
        try {
            locationObject[exit] = await db.Location.findOne({ locationName: thisLocation }).populate('inventory.item');
        } catch (e) {
            console.log('ERROR IN DB CALL');
            console.log(e);
        }
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
        db.Player.findOneAndUpdate({ characterName: username }, { $set: { lastLocation: newLocation } }, { new: true })
            .populate('inventory.item')
            .then(returnData => {
                resolve(returnData);
            })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                reject(e);
            });
    });
}

const findLocationData = (locationName) => {
    return new Promise((resolve, reject) => {
        db.Location.findOne({ locationName: locationName })
            .populate('inventory.item')
            .then(returnData => {
                resolve(returnData);
            })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                reject(e);
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
    rememberLocation(user, newLocation).then((user) => {
        io.to(socket.id).emit("playerUpdate", user)
    });
    //find locations, return chunk
    findLocationData(newLocation).then(currentLocationData => {

        resolveLocationChunk(currentLocationData).then(chunk => {
            io.to(socket.id).emit('locationChunk', chunk);
            location = chunk;
            io.to(socket.id).emit('moveQueueForeward', { locationChunk: chunk, characterName: socket.nickname });
        });

    })
}

module.exports = {
    resolveLocationChunk,
    rememberLocation,
    findLocationData,
    move
}