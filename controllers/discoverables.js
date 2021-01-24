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

const discFunctions = {
    discGet: function discGet({ io, socket, itemName, socketProp, itemID, user, quiet }) {
        if (socket[socketProp] || isInUserInventory(itemName, user)) {
            console.log(`Already have ${itemName}`)
            io.to(socket.id).emit('failure', `You already got the ${itemName}`)
        } else {
            // Run Function Here!!
            socket[socketProp] = true
            incrementItemUpdateOne({itemId:itemID, targetName:user.characterName, type:"player", quantity:1}).then(returnData => {
                if (!returnData) { //increment was not successful
                    pushItemToInventoryReturnData({itemId:itemID, targetName:user.characterName, type:"player", quantity:1}).then(returnData => {
                        io.to(socket.id).emit('invUpP', returnData.inventory);
                    });
                } else { //increment was successful
                    findPlayerData(user.characterName).then(returnData => {
                        io.to(socket.id).emit('invUpP', returnData.inventory);
                    })
                }
            });
            if (!quiet) {
                io.to(socket.id).emit('genericMessage', `You pick up the ${itemName}`)
            }
        }
    }
}


module.exports = function (props) {
    if (discFunctions[props.discFunction]) {
        discFunctions[props.discFunction](props)
    }
}