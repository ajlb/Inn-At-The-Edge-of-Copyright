const db = require("../../models");
const mongoose = require("mongoose");
const { findPlayerData } = require("./getDrop");
const ObjectId = require('mongoose').Types.ObjectId;


function findItem(itemName) {
    return new Promise(function (resolve, reject) {
        db.Item.findOne({ itemName: itemName }).then(data => {
            resolve(data);
        })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                console.log(e);
                reject(e);
            })
    });
}


function wearItem(io, socket, user, item, id, targetWords) {
    const targetSlot = targetWords ? targetWords.replace(/\s/g, "").toLowerCase() : false;
    console.log(`${user} wants to wear ${item} with item ID of ${id} in this equipment slot: ${targetWords}`)
    db.Item.findOne({ itemName: item })
        .then(returnData => {
            if (returnData === null) {
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                return false;
            } else if (returnData.equippable.length === 1) {
                let slot = returnData.equippable[0]
                //return info about what the user is already wearing
                findPlayerData(user)
                    .then(returnData => {
                        if (returnData === null) {
                            io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                            return false;
                        } else if (returnData.wornItems[slot] === null) {
                            //let user wear item if they are not already wearing something there
                            db.Player.findOneAndUpdate({ characterName: user }, { $set: { [`wornItems.${slot}`]: item } }, { new: true })
                                .populate('inventory.item')
                                .then(returnData => {
                                    db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(id) }] }).then(returnData => {
                                        db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).populate('inventory.item').then(finalData => {
                                            io.to(socket.id).emit('playerUpdate', finalData);
                                        });
                                    });
                                    io.to(user.toLowerCase()).emit('wear', `You wear your ${item} on your ${slot.slice(0, -4)}.`);
                                })
                                .catch(e => {
                                    console.log('ERROR IN DB CALL');
                                    console.log(e);
                                })
                        } else {
                            //failure message on no empty space to wear item
                            io.to(user.toLowerCase()).emit('failure', `You'll need to remove the ${returnData.wornItems[slot]} from your ${slot.slice(0, -4)} before you can wear the ${item}.`);
                        }
                    })
            } else if (returnData.equippable.length > 1) {
                //there are multiple slot options
                const options = returnData.equippable.map(slot => {
                    slot = slot.slice(0, -4);
                    switch (slot) {
                        case "rightHand":
                            slot = "right hand";
                            break;
                        case "leftHand":
                            slot = "left hand";
                            break;
                        case "twoHands":
                            slot = "two hands";
                            break;
                        default:
                            break;
                    }
                    return slot;
                })
                const uneditedSlots = returnData.equippable;
                //only wear on matching slot
                if (targetWords) {
                    let worn = false;
                    for (const editedSlot of options) {
                        if (editedSlot === targetWords.toLowerCase()) {
                            let slotIndex = options.indexOf(editedSlot);
                            worn = true;
                            db.Player.findOne({ characterName: user })
                                .then(returnData => {
                                    //If player's matching equipment slot is empty
                                    if (returnData.wornItems[uneditedSlots[slotIndex]] === null) {
                                        db.Player.updateOne({ characterName: user }, { $set: { [`wornItems.${uneditedSlots[slotIndex]}`]: item } })
                                            .then(returnData => {
                                                db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.item": ObjectId(id) }] })
                                                    .then(incrementData => {
                                                        db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true })
                                                            .populate('inventory.item')
                                                            .then(finalData => {
                                                                if (finalData === null) {
                                                                    io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                                                                    return false;
                                                                }
                                                                console.log(editedSlot, ["right hand", "left hand", "two hands"].indexOf(editedSlot) > -1);
                                                                if (["right hand", "left hand", "two hands"].indexOf(editedSlot) < 0) {
                                                                    io.to(user.toLowerCase()).emit('wear', `You wear your ${item} on your ${editedSlot}.`);
                                                                } else {
                                                                    io.to(user.toLowerCase()).emit('wear', `You wear your ${item} in your ${editedSlot}.`);
                                                                }
                                                                io.to(user.toLowerCase()).emit('playerUpdate', finalData);
                                                            })
                                                            .catch(e => {
                                                                console.log('ERROR IN DB CALL');
                                                                console.log(e);
                                                            })
                                                    })
                                                    .catch(e => {
                                                        console.log('ERROR IN DB CALL');
                                                        console.log(e);
                                                    })
                                            })
                                            .catch(e => {
                                                console.log('ERROR IN DB CALL');
                                                console.log(e);
                                            })
                                        //if player's matching equipment slot is full
                                    } else {
                                        io.to(user.toLowerCase()).emit('failure', `You'll need to remove the ${returnData.wornItems[uneditedSlots[slotIndex]]} from your ${editedSlot} before you can wear the ${item}.`);
                                    }
                                })
                                .catch(e => {
                                    console.log('ERROR IN DB CALL');
                                    console.log(e);
                                })
                        }
                    }
                    if (!worn) {//if user didn't put in a matching slot
                        io.to(user.toLowerCase()).emit('green', `You can't wear that item there.`);
                    }
                } else {//if multiple slots but user didn't specify
                    io.to(user.toLowerCase()).emit('green', `Where do you want to wear it? (${options.join(", ")})`);
                }
            } else {//non wearable item
                io.to(user.toLowerCase()).emit('green', `You can't wear that.`);
            }
        })
        .catch(e => {
            console.log('ERROR IN DB CALL');
            console.log(e);
        });

}




function removeItem(io, socket, user, item, targetSlot) {
    let itemId;
    findItem(item).then(data => itemId = data._id);
    switch (targetSlot) {
        case "lefthand":
            targetSlot = "leftHand";
            break;
        case "righthand":
            targetSlot = "rightHand";
            break;
        case "twohands":
            targetSlot = "twoHands";
            break;
        default:
            break;
    }
    //empty player's equipment slot
    db.Player.updateOne({ characterName: user }, { $set: { [`wornItems.${targetSlot}`]: null } }).then(returnData => {
        if (returnData === null) {
            io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
            return false;
        }
        //only add item to inventory if the empty goes through
        else if (returnData.nModified === 1) {
            console.log('itemId: ' + itemId);
            db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.item": itemId }] })
                .then(returnData => {
                    if (returnData === null) {
                        io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                        return false;
                    }
                    targetSlot = targetSlot.slice(0, -4).toLowerCase();
                    switch (targetSlot) {
                        case "lefthand":
                            targetSlot = "left hand";
                            break;
                        case "righthand":
                            targetSlot = "right hand";
                            break;
                        case "twohands":
                            targetSlot = "two hands";
                            break;
                        default:
                            break;
                    }
                    //if increment succeeded, there was already one there
                    if (returnData.nModified === 1) {
                        //send success
                        db.Player.findOne({ characterName: user }).populate('inventory.item')
                            .then(returnData => {
                                if (returnData === null) {
                                    io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                                    return false;
                                } else {
                                    io.to(socket.id).emit('playerUpdate', returnData);
                                }
                            })
                            .catch(e => {
                                console.log('ERROR IN DB CALL');
                                console.log(e);
                            });
                        io.to(socket.id).emit('remove', `You remove your ${item} from your ${targetSlot}.`);
                        //if increment failed, add a new entry to inventory
                    } else {
                        db.Player.findOneAndUpdate({ characterName: user }, { $push: { inventory: { item: itemId, quantity: 1 } } }, { new: true })
                            .populate('inventory.item')
                            .then(returnData => {
                                if (returnData === null) {
                                    io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");
                                    return false;
                                } else {
                                    //send success
                                    io.to(socket.id).emit('remove', `You remove your ${item} from your ${targetSlot}.`);
                                    io.to(socket.id).emit('playerUpdate', returnData);
                                }
                            })
                            .catch(e => {
                                console.log('ERROR IN DB CALL');
                                console.log(e);
                            });
                    }
                })
                .catch(e => {
                    console.log('ERROR IN DB CALL');
                    console.log(e);
                });
        }
    })
        .catch(e => {
            console.log('ERROR IN DB CALL');
            console.log(e);
        })

}

module.exports = {
    findItem,
    wearItem,
    removeItem
}