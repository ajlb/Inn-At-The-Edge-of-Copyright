const db = require("../../models");
const mongoose = require("mongoose");
const { findLocationData } = require("./move");
const ObjectId = require('mongoose').Types.ObjectId;

function decrementItemUpdateOne({ itemId, targetName, type, quantity = 1 }) {
    try {
        type = type ? type.toLowerCase() : undefined;
        return new Promise(function (resolve, reject) {
            if (type === "location") {
                for (let i = 1; i < quantity; i++) {
                    //for loop for quantity - 1 (1 will happen in main Location update)
                    console.log("i:", i);
                    db.Location.updateOne({ locationName: targetName }, { $pop: { "inventory.$[item].dropTime": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).catch(e => {
                        console.log('ERROR IN location decrement additional quantity popper(getDrop.js)');
                        reject(e);
                    })
                }

                db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": -quantity }, $pop: { "inventory.$[item].dropTime": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] })
                    .then(data => {
                        resolve(data);
                    })
                    .catch(e => {
                        console.log('ERROR IN decrement location DB CALL(getDrop.js)');
                        reject(e);
                    });
            } else if (type === "player") {

                //for loop for dropTimeLength - 1 (1 will happen in main Location update)
                for (let i = 1; i < quantity; i++) {
                    console.log("i:", i);
                    db.Player.updateOne({ characterName: targetName }, { $pop: { "inventory.$[item].dropTime": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).catch(e => {
                        console.log('ERROR IN player decrement additional quantity popper(getDrop.js)');
                        reject(e);
                    })
                }
                db.Player.updateOne({ characterName: targetName }, { $inc: { "inventory.$[item].quantity": -quantity }, $pop: { "inventory.$[item].dropTime": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
                    resolve(data);
                })
                    .catch(e => {
                        console.log('ERROR IN decrement player DB CALL(getDrop.js)');
                        reject(e);
                    });//end db.Player.updateOne
            } else {
                reject("You must put in location or player for type.");
            }
        });
    } catch (e) {
        console.log("ERROR FROM decrementItem(getDrop.js):");
        console.log(e);
    }
}

function incrementItemUpdateOne({ itemId, targetName, type, quantity = 1 }) {
    try {
        type = type ? type.toLowerCase() : undefined;
        return new Promise(function (resolve, reject) {
            if (type === "location") {
                //for loop for dropTimeLength - 1 (1 will happen in main Location update)
                for (let i = 1; i < quantity; i++) {
                    console.log("i:", i);
                    db.Location.updateOne({ locationName: targetName }, { $push: { "inventory.$[item].dropTime": new Date() } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).catch(e => {
                        console.log('ERROR IN location increment additional quantity popper(getDrop.js)');
                        reject(e);
                    })
                }
                db.Location.updateOne({ locationName: targetName }, { $inc: { "inventory.$[item].quantity": quantity }, $push: { "inventory.$[item].dropTime": new Date() } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
                    if (data.nModified === 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                    .catch(e => {
                        console.log('ERROR increment location IN DB CALL');
                        reject(e);
                    })
            } else if (type === "player") {
                targetName = targetName.toLowerCase()
                console.log("in increment player, trying to increment", targetName);
                //for loop for dropTimeLength - 1 (1 will happen in main Location update)
                for (let i = 1; i < quantity; i++) {
                    console.log("i:", i);
                    db.Player.updateOne({ characterNameLowerCase: targetName }, { $push: { "inventory.$[item].dropTime": new Date() } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).catch(e => {
                        console.log('ERROR IN player increment additional quantity popper(getDrop.js)');
                        reject(e);
                    })
                }
                db.Player.updateOne({ characterNameLowerCase: targetName }, { $inc: { "inventory.$[item].quantity": quantity }, $push: { "inventory.$[item].dropTime": new Date() } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(itemId) }] }).then(data => {
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
    } catch (e) {
        console.log("ERROR FROM incrementItem(getDrop.js):");
        console.log(e);
    }
}

function pushItemToInventoryReturnData({ itemId, targetName, type, quantity = 1 }) {
    console.log("in pushItem");
    try {
        type = type ? type.toLowerCase() : undefined;
        return new Promise(function (resolve, reject) {
            console.log(`pushing ${itemId} to ${targetName}`);
            if (type === "location") {
                db.Location.findOne({ locationName: targetName })
                .then(initialLocationData => {
                    let thisLocation = initialLocationData;
                    let newItem = {
                        item:itemId,
                        quantity,
                        dropTime: []
                    }
                    for (i = 0; i < quantity; i++){
                        newItem.dropTime.push(new Date());
                    }
                    thisLocation.inventory.push(newItem);
                    db.Location.findOneAndUpdate({ locationName: targetName }, { $set: { inventory: thisLocation.inventory } }, { new: true })
                        .populate('inventory.item').then(data => {
                            resolve(data);
                        })
                        .catch(e => {
                            console.log('ERROR IN pushItemTo location DB CALL');
                            reject(e);
                        });
                })
            } else if (type === "player") {
                targetName = targetName.toLowerCase();
                db.Player.findOne({ characterNameLowerCase: targetName }).then(initialPlayerData => {
                    let thisPlayer = initialPlayerData;
                    let newItem = {
                        item:itemId,
                        quantity,
                        dropTime: []
                    };
                    for (i = 0; i < quantity; i++){
                        newItem.dropTime.push(new Date());
                    }
                    thisPlayer.inventory.push(newItem);
                    db.Player.findOneAndUpdate({ characterNameLowerCase: targetName }, { $set: { inventory: thisPlayer.inventory } }, { new: true })
                        .populate('inventory.item').then(data => {
                            resolve(data);
                        })
                        .catch(e => {
                            console.log('ERROR IN pushItemTo player DB CALL');
                            reject(e);
                        });
                })
            } else {
                reject("You must put in location or player for type.");
            }
        });
    } catch (e) {
        console.log("ERROR FROM pushItemToInventoryReturnData(getDrop.js):");
        console.log(e);
    }
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


function getItem(socket, io, target, itemId, user, location, quantity = 1) {
    quantity = 3;
    findLocationData(location).then(locationData => {
        for (const invItem of locationData.inventory) {
            if (invItem.item["_id"] == itemId) {
                console.log("FOUND ITEM");
                console.log("dropTimes:", invItem.dropTime.length);
                console.log("quantity:", quantity);
                if (!(invItem.dropTime.length >= quantity)) {
                    quantity = invItem.dropTime.length;
                    io.to(socket.id).emit('green', `There ${quantity > 1 ? 'are' : 'is'} only ${quantity} of those to pick up.`);
                }
                console.log("quantity:", quantity);

                //remove item from location
                decrementItemUpdateOne({ itemId, targetName: location, type: "location", quantity }).then(returnData => {
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
                incrementItemUpdateOne({ itemId, targetName: user, type: "player", quantity }).then(returnData => {
                    if (!returnData) { //increment was not successful
                        pushItemToInventoryReturnData({ itemId, targetName: user, type: "player", quantity }).then(returnData => {
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
        }


    })
}

function dropItem(socket, io, target, itemId, user, location, quantity = 1) {
    quantity = 3;
    findPlayerData(user).then(playerData => {
        for (const invItem of playerData.inventory) {
            if (invItem.item["_id"] == itemId) {
                console.log("FOUND ITEM");
                if (!(invItem.dropTime.length >= quantity)) {
                    quantity = invItem.dropTime.length;
                    io.to(socket.id).emit('green', `You only have ${quantity} of those to drop.`);
                }
                //remove item from giver's inventory
                decrementItemUpdateOne({ itemId, targetName: user, type: "player", quantity }).then(returnData => {
                    scrubInventoryReturnData(user, "player").then(returnData => {
                        if (returnData === null) {
                            io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                            return false;
                        } else {
                            io.to(socket.id).emit('invUpP', returnData.inventory);
                        }
                    });//end scrub
                });//end decrement item
                //add item to recipient's inventory
                incrementItemUpdateOne({ itemId, targetName: location, type: "location", quantity }).then(returnData => {
                    if (!returnData) {//increment item failure, add item
                        pushItemToInventoryReturnData({ itemId, targetName: location, type: "location", quantity }).then(returnData => {
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
                })//end incrementItem
            }//end if correct item
        }//end for item in inv
    });//end find player data
}

function giveItem(socket, io, target, item, itemId, user, location, quantity = 1) {
    //remove item from giver's inventory
    decrementItemUpdateOne({ itemId, targetName: user, type: "player", quantity }).then(returnData => {
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
    incrementItemUpdateOne({ itemId, targetName: target, type: "player", quantity }).then(returnData => {
        if (!returnData) { //increment was not successful
            pushItemToInventoryReturnData({ itemId, targetName: target, type: "player", quantity }).then(returnData => {
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