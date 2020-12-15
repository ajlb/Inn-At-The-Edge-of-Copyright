const { incrementItemUpdateOne, pushItemToInventoryReturnData, findPlayerData } = require("./userInput/getDrop");
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
                            });
                        } else { //increment was successful
                            findPlayerData(user.characterName).then(returnData => {
                                io.to(socket.id).emit('invUpP', returnData.inventory);
                            })
                        }
                    });
                }
            }
        }
    }
}

module.exports = npcFunctions;