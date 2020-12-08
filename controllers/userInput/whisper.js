const db = require("../../models");
const mongoose = require("mongoose");


function whisper(socket, io, message, players, user) {
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
        db.Player.findOne({ characterNameLowerCase: playerTo }).then(data => {
            io.to(socket.id).emit('whisperFrom', { message, userTo: data.characterName });
            io.to(playerTo).emit('whisperTo', { message, userFrom: user });
        })
    }
}


module.exports = {
    whisper
}