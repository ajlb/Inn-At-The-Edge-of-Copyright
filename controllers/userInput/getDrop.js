const db = require("../../models");
const mongoose = require("mongoose");

function decrementItemUpdateOne(item, targetName, type) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(data => {
                resolve(data);
            });
        } else if (type === "player") {
            db.Player.updateOne({ characterName: targetName }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(data => {
                resolve(data);
            });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function incrementItemUpdateOne(item, targetName, type) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(data => {
                data.nModified === 1 ? resolve(true) : resolve(false);
            })
        } else if (type === "player") {
            db.Player.updateOne({ characterName: targetName }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(data => {
                data.nModified === 1 ? resolve(true) : resolve(false);
            })
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function pushItemToInventoryReturnData(item, targetName, type) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.findOneAndUpdate({ locationName: targetName }, { $push: { inventory: { name: item, quantity: 1, equipped: 0 } } }, { new: true }).then(data => {
                resolve(data);
            });
        } else if (type === "player") {
            db.Player.findOneAndUpdate({ characterName: targetName }, { $push: { inventory: { name: item, quantity: 1, equipped: 0 } } }, { new: true }).then(data => {
                resolve(data);
            });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function findPlayerData(username) {
    return new Promise(function (resolve, reject) {
        if (username === undefined) {
            reject("You must put in a username");
        } else {
            db.Player.findOne({ characterName: username }).then(data => {
                resolve(data);
            });
        }
    });
}

function scrubInventoryReturnData(target, type){
    return new Promise(function(resolve, reject){
        if (type === "location"){
            db.Location.findOneAndUpdate({ locationName: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(data=>{
                resolve(data);
            });
        } else if (type === "player"){
            db.Player.findOneAndUpdate({ characterName: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(data=>{
                resolve(data);
            })
        } else {
            reject("You must put in location or player for type.");
        }
    });
}


module.exports = {
    decrementItemUpdateOne,
    incrementItemUpdateOne,
    pushItemToInventoryReturnData,
    findPlayerData,
    scrubInventoryReturnData
}