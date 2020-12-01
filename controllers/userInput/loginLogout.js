const db = require("../../models");
const mongoose = require("mongoose");


function login(socket, io, message, players){
    return new Promise(function(resolve, reject){
        if (message === "You must log in first! Type 'log in [username]'") {
            io.to(socket.id).emit('logFail', message);
        } else {
            console.log(`${message} wants to log in.`);
            const usernameLowerCase = message.toLowerCase();
            if (players.indexOf(usernameLowerCase) === -1) {
                socket.join(usernameLowerCase);
                players.push(usernameLowerCase);//delete once Auth is complete
                io.to(usernameLowerCase).emit('log in', message);
                console.log(`${message} is now fake logged in.`);
                //find and retrieve user Data, join location room
                db.Player.findOneAndUpdate({ characterName: message }, { $set: { isAwake: true, isOnline: true } }, { new: true }).select("-password").then(userData => {
                    let userLocation
                    if (userData === null) {
                        userLocation = "Inn Lobby";
                    } else {
                        userLocation = userData.lastLocation;
                    }
                    io.to(usernameLowerCase).emit('playerData', userData)
                    socket.join(userLocation);
                     

                    io.to(userLocation).emit('move', { actor: message, direction: "ether", cardinal: true, action: "arrive"});
    
                    resolve(userLocation);
                });
            } else {
                io.to(socket.id).emit('logFail', `${message} is already logged in.`);
                console.log(`${message} is already in players list. Cannot log in.`);
                resolve(false);
            }
        }
    });
}

module.exports = {
    login
}