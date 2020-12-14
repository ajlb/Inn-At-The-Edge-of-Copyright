const { incrementItemUpdateOne, pushItemToInventoryReturnData, findPlayerData } = require("./userInput/getDrop");

const discFunctions = {
    discGet: function discGet({ io, socket, itemName, socketProp, itemID, user, quiet }) {
        if (socket[socketProp]) {
            console.log(`Already have ${itemName}`)
            io.to(socket.id).emit('failure', `You already got the ${itemName}`)
        } else {
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
                io.to(location).emit('get', { target: itemName, actor: user });
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