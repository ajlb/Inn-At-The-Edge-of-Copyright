const { incrementItemUpdateOne, pushItemToInventoryReturnData, findPlayerData } = require("./userInput/getDrop");
const { updatePlayerQuest, assignAndUpdatePlayerQuest, assignQuest } = require('./questsController');
const db = require("../models")

// 
// ALL NPC FUNCTIONS MUST RETURN A PROMISE
// 


function isInUserInventory(itemName, user) {
    itIs = false;
    user.inventory.forEach(itemObj => {
        if (itemObj.item.itemName.includes(itemName)) itIs = true;
    })
    Object.keys(user.wornItems).forEach(slotKey => {
        if (user.wornItems[slotKey] && user.wornItems[slotKey].includes(itemName)) itIs = true;
    })
    return itIs;
}

const npcFunctions = {
    "Ford": {
        giveRing: function giveRing({ io, socket, socketProp, user }) {
            return new Promise((res, rej) => {
                let itemName = 'dull ring';
                let itemID = '5fc32531b2009d226ef5b862';
                if (!isInUserInventory(itemName, user)) {
                    if (!socket[socketProp]) {
                        // Run Function Here!!
                        socket[socketProp] = true
                        incrementItemUpdateOne(itemID, user.characterName, "player").then(returnData => {
                            if (!returnData) { //increment was not successful
                                pushItemToInventoryReturnData(itemID, user.characterName, "player").then(returnData => {
                                    io.to(socket.id).emit('invUpP', returnData.inventory);
                                    res()
                                });
                            } else { //increment was successful
                                findPlayerData(user.characterName).then(returnData => {
                                    io.to(socket.id).emit('invUpP', returnData.inventory);
                                    res()
                                })
                            }
                        });
                    } else {
                        res()
                    }
                } else {
                    res()
                }
            })
        },
        assignQuest: function ({ io, socket, user, questTitle }) {
            return new Promise((res, rej) => {
                assignQuest(io, socket, { user, questTitle })
                    .then(() => {
                        res()
                    })
                    .catch((e) => {
                        console.log("ERROR IN assignQuest", e)
                        rej(e)
                    });
            })
        },
        takeSock: function ({ io, socket, user }) {
            return new Promise((res, rej) => {
                updatePlayerQuest(io, socket, {
                    user,
                    questTitle: "The Missing Stocking",
                    newObjectiveRef: "completed"
                })
                    .then(() => {
                        res()
                    })
                    .catch(e => {
                        console.log("ERROR IN updatePlayerQuest")
                        rej(e)
                    })
            })
        }
    }
}

module.exports = npcFunctions;