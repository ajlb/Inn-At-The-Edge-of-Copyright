const db = require("../../models");
const mongoose = require("mongoose");
const { findLocationData } = require("./move");

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

function scrubInventoryReturnData(target, type) {
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.findOneAndUpdate({ locationName: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(data => {
                resolve(data);
            });
        } else if (type === "player") {
            db.Player.findOneAndUpdate({ characterName: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(data => {
                resolve(data);
            })
        } else {
            reject("You must put in location or player for type.");
        }
    });
}


function getItem(socket, io, target, user, location) {
    //remove item from location
    decrementItemUpdateOne(target, location, "location").then(returnData => {
        scrubInventoryReturnData(location, "location").then(returnData => {
            io.to(location).emit('invUpL', returnData.inventory);

        });
    });
    //give item to player
    incrementItemUpdateOne(target, user, "player").then(returnData => {
        if (!returnData) { //increment was not successful
            pushItemToInventoryReturnData(target, user, "player").then(returnData => {
                io.to(socket.id).emit('invUpP', returnData.inventory);
            });
        } else { //increment was successful
            findPlayerData(user).then(returnData => {
                io.to(socket.id).emit('invUpP', returnData.inventory);
            })
        }
        io.to(location).emit('get', { target, actor: user });
    });
}

function dropItem(socket, io, target, user, location) {
    //remove item from giver's inventory
    decrementItemUpdateOne(target, user, "player").then(returnData => {
        scrubInventoryReturnData(user, "player").then(returnData => {
            io.to(socket.id).emit('invUpP', returnData.inventory);
        });
    });
    //add item to recipient's inventory
    incrementItemUpdateOne(target, location, "location").then(returnData => {
        if (!returnData) {//increment item failure, add item
            pushItemToInventoryReturnData(target, location, "location").then(returnData => {
                io.to(location).emit('invUpL', returnData.inventory);

            });
        } else {//increment item success
            findLocationData(location).then(returnData => {
                io.to(location).emit('invUpL', returnData.inventory);
            })
        }
        io.to(location).emit('drop', { target, actor: user });
    })
}

function giveItem(socket, io, target, item, user, location) {
    //remove item from giver's inventory
    decrementItemUpdateOne(item, user, "player").then(returnData => {
        scrubInventoryReturnData(user, "player").then(returnData => {
            io.to(socket.id).emit('invUpP', returnData.inventory);
        });
    });
    //add item to target's inventory
    incrementItemUpdateOne(item, target, "player").then(returnData => {
        //if increment succeeded, there was already one there
        if (!returnData) {
            pushItemToInventoryReturnData(item, target, "player").then(returnData => {
                io.to(target.toLowerCase()).emit('invUpP', returnData.inventory);

            });
            //if increment failed, add a new entry to inventory
        } else {
            findPlayerData(target).then(returnData => {
                io.to(target.toLowerCase()).emit('invUpP', returnData.inventory);
            })
        }
        io.to(location).emit('give', { target, item, actor: user });

    });
}


module.exports = {
    decrementItemUpdateOne,
    incrementItemUpdateOne,
    pushItemToInventoryReturnData,
    findPlayerData,
    scrubInventoryReturnData,
    getItem,
    dropItem,
    giveItem
}