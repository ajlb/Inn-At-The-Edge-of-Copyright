const db = require("../../models");
const mongoose = require("mongoose");


function login(socket, io, userCharacter, players){
    return new Promise(function(resolve, reject){
            const usernameLowerCase = userCharacter.toLowerCase();
            if (players.indexOf(userCharacter) === -1) {
                socket.join(usernameLowerCase);
                players.push(userCharacter);//delete once Auth is complete
                io.to(usernameLowerCase).emit('log in', userCharacter);
                console.log(`${userCharacter} is now logged in.`);
                //find and retrieve user Data, join location room
                db.Player.findOneAndUpdate({ characterName: userCharacter }, { $set: { isAwake: true, isOnline: true } }, { new: true })
                .select("-password")
                .populate('inventory.item')
                .then(userData => {
                    let userLocation
                    if (userData === null) {
                        userLocation = "Inn Lobby";
                    } else {
                        userLocation = userData.lastLocation;
                    }
                    io.to(usernameLowerCase).emit('playerData', userData)
                    socket.join(userLocation);
                     

                    io.to(userLocation).emit('move', { actor: userCharacter, direction: "ether", cardinal: true, action: "arrive"});
    
                    resolve(userLocation);
                });
            } else {
                io.to(socket.id).emit('logFail', `${userCharacter} is already logged in.`);
                console.log(`${userCharacter} is already in players list. Cannot log in.`);
                resolve(false);
            }
        
    });
}

const getUsers = (io, userLocation, playernicknames) => {
    let roster = io.sockets.adapter.rooms;
    roomUsers = roster.get(userLocation);
    currentUsersOfRoom = [];
    if (!(roomUsers === undefined)){
        for (const socketID of roomUsers.keys()) {
            if (!(playernicknames[socketID] === undefined)){
                currentUsersOfRoom.push(playernicknames[socketID].nickname)
            }
        }
    }
    io.to(userLocation).emit('who', {currentUsersOfRoom, userLocation});
}


module.exports = {
    login,
    getUsers,
}