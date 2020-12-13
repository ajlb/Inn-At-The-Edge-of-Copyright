const { io } = require("socket.io-client");
const db = require("../../models");
const { decrementItemUpdateOne, scrubInventoryReturnData, findPlayerData } = require("./getDrop");
// const mongoose = require("mongoose");
let statIncrease;

function getItemFromName(itemName) {
    return new Promise((resolve, reject) => {
        db.Item.findOne({ itemName }).then(data => {
            resolve(data);
        }).catch(e => {
            console.log("DB CATCH FROM getItemIdFromName:");
            console.log(e);
            reject(e);
        })
    })
}

function effectMessage(stat, increaseValue) {
    switch (stat) {
        case "HP":
            message = (increaseValue > 0) ? 'You feel stronger!' : 'You feel worse...'
            message = (increaseValue === 0) ? "You don't feel any different." : message; 
            return message;
        case "WIS":
            message = (increaseValue > 0) ? 'You feel wiser!' : 'You feel less wise...'
            message = (increaseValue === 0) ? "You don't feel any different." : message;
            return message;
        case "STR":
            message = (increaseValue > 0) ? 'You feel stronger!' : 'You feel weaker...'
            message = (increaseValue === 0) ? "You don't feel any different." : message;
            return message;
        case "CHA":
            message = (increaseValue > 0) ? 'You feel more charismatic!' : 'You feel less charismatic...'
            message = (increaseValue === 0) ? "You don't feel any different." : message;
            return message;
        case "XP":
            message = (increaseValue > 0) ? 'You feel more experienced!' : 'You feel like you were better off before...'
            message = (increaseValue === 0) ? "You don't feel any different." : message;
            return message;
        case "DEX":
            message = (increaseValue > 0) ? 'You feel more nimble!' : 'You feel more clumsy...'
            message = (increaseValue === 0) ? "You don't feel any different." : message;
            return message;
        default:
            break;
    }
}

function deleteItemFromInventory(itemId, playerOrLocationName, playerOrLocationType) {
    return new Promise(function (resolve, reject) {
        try {
            //remove item from giver's inventory
            decrementItemUpdateOne(itemId, playerOrLocationName, playerOrLocationType).then(returnData => {
                scrubInventoryReturnData(playerOrLocationName, playerOrLocationType).then(returnData => {
                    if (returnData) {
                        resolve(returnData);
                    }
                });
            });
        } catch (e) {
            console.log("ERROR FROM deleteItemFromInventory(eat.js):");
            console.log(e);
            reject(e);
        }
    });
}

function applyEffectFromItemReturnData(playerName, affectedStat, incrementAmount) {
    return new Promise(function (resolve, reject) {
        try {
            findPlayerData(playerName).then(initialPlayerData => {
                // console.log(initialPlayerData);
                playerName = playerName.toLowerCase();
                const updateObject = {};
                if (initialPlayerData.stats[affectedStat] + incrementAmount <= initialPlayerData.stats['max' + affectedStat]) {
                    console.log('in less than or equal to max');
                    updateObject['stats.'+ affectedStat] = incrementAmount
                } else {
                    console.log('in increase would surpass max');
                    // console.log('stats' + affectedStat, initialPlayerData.stats[affectedStat]);
                    // console.log('stats.max' + affectedStat, initialPlayerData.stats['max' + affectedStat]);
                    incrementAmount = initialPlayerData.stats['max' + affectedStat] - initialPlayerData.stats[affectedStat];
                    statIncrease = incrementAmount; //this is for remembering later what the increase was
                    updateObject['stats.'+affectedStat] = incrementAmount;
                }
                console.log(updateObject);
                db.Player.findOneAndUpdate({ characterNameLowerCase: playerName }, { $inc: updateObject }, { new: true })
                .populate('inventory.item')
                .then(playerData => {
                    // console.log(playerData);
                    resolve(playerData);
                }).catch(e => {
                    console.log("ERROR IN applyEffectFromItemReturnData DB CALL:");
                    console.log(e);
                    reject(e);
                })
            })
        } catch (e) {
            console.log("ERROR FROM applyEffectFromItemReturnData(eat.js):");
            console.log(e);
            reject(e);
        }
    });
}


function eatItem(socket, io, target, itemId, player, locationName) {
    try {
        getItemFromName(target).then(itemData => {
            // console.log(itemData);
            if (itemData.edible) {
                deleteItemFromInventory(itemData._id, player, "player").then(returnData => {
                    io.to(socket.id).emit('invUpP', returnData.inventory);
                });
                for (const param in itemData) {
                    if (itemData[param] && param.endsWith("effect") && (typeof parseInt(itemData[param]) === "number")) {
                        const stat = param.slice(0, -6);
                        statIncrease = parseInt(itemData[param]);
                        applyEffectFromItemReturnData(player, stat, statIncrease).then(playerData => {
                            io.to(socket.id).emit("playerUpdate", playerData);
                            io.to(locationName).emit('eat', { actor: player, eatenItem: target, actorMessage: effectMessage(stat, statIncrease)});
                        })
                    }
                }
            } else {
                io.to(player.toLowerCase()).emit('failure', `The ${target} doesn't seem like something that's meant to be eaten.`)
            }
        })

    } catch (e) {
        console.log("ERROR FROM eatItem:");
        console.log(e);
    }
}

module.exports = {
    eatItem
}