const db = require("../../models");
const mongoose = require("mongoose");
const { findLocationData } = require("./move");
const ObjectId = require('mongoose').Types.ObjectId;

function decrementItemUpdateOne({itemId, targetName, type, quantity=1}) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": -quantity }, $pop: { "inventory.$[item].dropTime": -quantity } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] })
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN decrement location DB CALL');
                    reject(e);
                });
        } else if (type === "player") {
            db.Player.updateOne({ characterName: targetName }, { $inc: { "inventory.$[item].quantity": -quantity }, $pop: {"inventory.$[item].dropTime": -quantity} }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
                resolve(data);
            })
                .catch(e => {
                    console.log('ERROR IN decrement player DB CALL');
                    reject(e);
                });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function incrementItemUpdateOne({itemId, targetName, type, quantity=1}) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": quantity }, $push: {"inventory.$[item].dropTime": new Date()} }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
                data.nModified === 1 ? resolve(true) : resolve(false);
            })
                .catch(e => {
                    console.log('ERROR increment location IN DB CALL');
                    reject(e);
                })
        } else if (type === "player") {
            targetName = targetName.toLowerCase()
            console.log("in increment player, trying to increment", targetName);
            db.Player.updateOne({ characterNameLowerCase: targetName }, { $inc: { "inventory.$[item].quantity": quantity }, $push: {"inventory.$[item].dropTime": new Date()} }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
                data.nModified === 1 ? resolve(true) : resolve(false);
            })
                .catch(e => {
                    console.log('ERROR IN increment player DB CALL');
                    reject(e);
                });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function pushItemToInventoryReturnData({itemId, targetName, type, quantity=1}) {
    type = type ? type.toLowerCase() : undefined;
    return new Promise(function (resolve, reject) {
        console.log(`pushing ${itemId} to ${targetName}`);
        if (type === "location") {
            db.Location.findOneAndUpdate({ locationName: targetName }, { $push: { inventory: { item: itemId, quantity, dropTime: [new Date()] } } }, { new: true })
                .populate('inventory.item').then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN pushItemTo location DB CALL');
                    reject(e);
                });
        } else if (type === "player") {
            targetName = targetName.toLowerCase();
            db.Player.findOneAndUpdate({ characterNameLowerCase: targetName }, { $push: { inventory: { item: itemId, quantity, dropTime: [new Date()] } } }, { new: true })
                .populate('inventory.item').then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN pushItemTo player DB CALL');
                    reject(e);
                });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}

function findPlayerData(username) {
    return new Promise(function (resolve, reject) {
        username = username.toLowerCase();
        if (username === undefined) {
            reject("You must put in a username");
        } else {
            db.Player.findOne({ characterNameLowerCase: username })
                .populate('inventory.item').then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN findPlayerData DB CALL');
                    reject(e);
                });
        }
    });
}

function scrubInventoryReturnData(target, type) {
    return new Promise(function (resolve, reject) {
        if (type === "location") {
            db.Location.findOneAndUpdate({ locationName: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true })
                .populate('inventory.item').then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN scrub location DB CALL');
                    reject(e);
                });
        } else if (type === "player") {
            target = target.toLowerCase();
            db.Player.findOneAndUpdate({ characterNameLowerCase: target }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true })
                .populate('inventory.item').then(data => {
                    resolve(data);
                })
                .catch(e => {
                    console.log('ERROR IN scrub player DB CALL');
                    reject(e);
                });
        } else {
            reject("You must put in location or player for type.");
        }
    });
}


function getItem(socket, io, target, itemId, user, location, quantity=1) {
    //remove item from location
    decrementItemUpdateOne({itemId, targetName:location, type:"location", quantity}).then(returnData => {
        scrubInventoryReturnData(location, "location").then(returnData => {
            if (returnData === null) {
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                return false;
            } else {
                io.to(location).emit('invUpL', returnData.inventory);
            }

        });
    });
    //give item to player
    incrementItemUpdateOne({itemId, targetName:user, type:"player", quantity}).then(returnData => {
        if (!returnData) { //increment was not successful
            pushItemToInventoryReturnData({itemId, targetName:user, type:"player", quantity}).then(returnData => {
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

function dropItem(socket, io, target, itemId, user, location, quantity=1) {
    //remove item from giver's inventory
    decrementItemUpdateOne({itemId, targetName:user, type:"player", quantity}).then(returnData => {
        scrubInventoryReturnData(user, "player").then(returnData => {
            if (returnData === null) {
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                return false;
            } else {
                io.to(socket.id).emit('invUpP', returnData.inventory);
            }
        });
    });
    //add item to recipient's inventory
    incrementItemUpdateOne({itemId, targetName:location, type:"location", quantity}).then(returnData => {
        if (!returnData) {//increment item failure, add item
            pushItemToInventoryReturnData({itemId, targetName:location, type:"location", quantity}).then(returnData => {
                io.to(location).emit('invUpL', returnData.inventory);

            });
        } else {//increment item success
            findLocationData(location).then(returnData => {
                if (returnData === null) {
                    io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                    return false;
                } else {
                    io.to(location).emit('invUpL', returnData.inventory);
                }
            })
        }
        io.to(location).emit('drop', { target, actor: user });
    })
}

function giveItem(socket, io, target, item, itemId, user, location, quantity=1) {
    //remove item from giver's inventory
    decrementItemUpdateOne({itemId, targetName:user, type:"player", quantity}).then(returnData => {
        scrubInventoryReturnData(user, "player").then(returnData => {
            if (returnData === null) {
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                return false;
            } else {
                io.to(socket.id).emit('invUpP', returnData.inventory);
            }
        });
    });
    //add item to target's inventory
    console.log(target);
    //give item to player
    incrementItemUpdateOne({itemId, targetName:target, type:"player", quantity}).then(returnData => {
        if (!returnData) { //increment was not successful
            pushItemToInventoryReturnData({itemId, targetName:target, type:"player", quantity}).then(returnData => {
                console.log(returnData.inventory);
                io.to(target.toLowerCase()).emit('invUpP', returnData.inventory);
            });
        } else { //increment was successful
            findPlayerData(target).then(returnData => {
                console.log(returnData);
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