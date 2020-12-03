const db = require("../../models");
const mongoose = require("mongoose");




function wakeUp(user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: true } }, (err, playerData) => {
            if (err) reject(err);
            if (playerData.isAwake) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function goToSleep(user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: false } }, (err, playerData) => {
            if (err) reject(err);
            if (!playerData.isAwake) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}


module.exports = {
    wakeUp,
    goToSleep
}