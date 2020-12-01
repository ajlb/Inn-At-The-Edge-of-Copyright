const db = require("../../models");
const mongoose = require("mongoose");


function incrementDex(user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $inc: { "stats.DEX": 0.1 } }, { new: true }).then(data => {
            resolve(data);
        });
    });
}

module.exports = {
    incrementDex
}