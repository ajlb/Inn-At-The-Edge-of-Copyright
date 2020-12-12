const db = require("../../models");
const mongoose = require("mongoose");


function incrementDex(user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $inc: { "stats.DEX": 0.05 } }, { new: true }).populate('inventory.item')
        .then(data => {
            resolve(data);
        })
        .catch(e=>{
            console.log('ERROR IN DB CALL');
            reject(e);
        });
    });
}

function incrementDexAndStr({user, dex, str}) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $inc: { "stats.DEX": dex, "stats.STR": str } }, { new: true }).populate('inventory.item')
        .then(data => {
            resolve(data);
        })
        .catch(e=>{
            console.log('ERROR IN DB CALL');
            reject(e);
        });
    });
}

module.exports = {
    incrementDex,
    incrementDexAndStr
}