const db = require("../../models");
const mongoose = require("mongoose");


function whisper(socket, io, message, players, userData) {
    let playerTo
    console.log(`${socket.nickname} is whispering`);

    // How this works:
    //   This for loop is going to see if the message received from the user starts with a player name
    //   Because player names are only allowed to be three words max(two spaces),
    //   this for loop iterates through the first three words of the users message starting at 3 and working its way down
    // if at any point in the loop it recognizes a player's name, it will set the playerTo variable to that player's name
    for (let i = 2; i >= 0; i--) {
        const messageString = message.toLowerCase().split(' ').slice(0, i + 1).join(' ');
        players.forEach(player => {
            if (player.toLowerCase() === messageString.toLowerCase()) {
                console.log(`${socket.nickname}'s whisper found ${messageString}`);
                playerTo = messageString;
                message = message.split(' ').slice(i + 1).join(' ');
            }
        })
    }
    if (playerTo === undefined) {
        console.log('there was no matching player');
        io.to(socket.id).emit('failure', "There is nobody here by that name.");
    } else {
        console.log("I'm sending a whisper");
        db.Player.find({ characterNameLowerCase: { $in: [playerTo, userData.characterNameLowerCase] } })
            .then(data => {
                if (!(data === null)) {
                    // console.log(data);
                    data.forEach(playerObj => {
                        // console.log(playerObj)
                        if (playerObj.characterNameLowerCase === playerTo) {
                            playerTo = playerObj
                        }
                        // return playerObj.characterName === playerTo
                    });
                    // console.log(playerTo)
                    if (playerTo.lastLocation === userData.lastLocation) {
                        io.to(socket.id).emit('whisperFrom', { message, userTo: playerTo.characterName });
                        io.to(playerTo.characterNameLowerCase).emit('whisperTo', { message, userFrom: userData.characterName });
                    } else {
                        io.to(socket.id).emit('failure', `${playerTo.characterName} is not in the same room as you`)
                    }
                } else {
                    io.to(socket.id).emit('failure', "Something went wrong")
                }
            })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                console.log(e);
            })
    }
}


module.exports = {
    whisper
}