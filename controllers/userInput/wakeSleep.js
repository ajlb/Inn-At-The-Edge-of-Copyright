const db = require("../../models");
const mongoose = require("mongoose");




function wakeUp(io, socket, user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: true } }, (err, playerData) => {
            if (err) reject(err);
            if (playerData.isAwake) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                console.log(e);
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");

            });
    });
}

function goToSleep(io, socket, user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: false } }, (err, playerData) => {
            if (err) reject(err);
            if (!playerData.isAwake) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                console.log(e);
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");

            });
    });
}


module.exports = {
    wakeUp,
    goToSleep
}