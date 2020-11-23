const db = require("../models");
const mongoose = require("mongoose");


// this array is fully temporary and is only here in place of the database until that is set up
let players = ['the mando', 'shambles', 'cosmo the magnificent'];
let users = {};

module.exports = function (io) {
    // this runs only when the user initially connects
    // if the user refreshes their browser, it will disconnect and reconnect them
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected!`);
        // possibly do a DB call to state that the use is online?

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected...`);
            // possibly do a DB call to state that the use is offline?
            //for now just deleting the user
            for (const user in users) {
                if (users[user].socketID === socket.id) {
                    //next two lines will not be necessary once Auth is in pace
                    const playerIndex = players.indexOf(user);
                    players = players.splice(playerIndex, 1);
                    delete users[user];
                }
            }
        })

        socket.on('log in', message => {
            console.log("log in recieved");
            if (message === "You must log in first!") {
                console.log("send message saying You must log in first!");
                io.to(socket.id).emit('logFail', message);
            } else {
                console.log(`${message} wants to log in.`);
                const usernameLowerCase = message.toLowerCase();
                if (players.indexOf(usernameLowerCase) === -1) {
                    socket.join(usernameLowerCase);
                    players.push(usernameLowerCase);//delete once Auth is complete
                    io.to(usernameLowerCase).emit('log in', message);
                    console.log(`${message} is now fake logged in.`);
                    db.Player.findOne({ characterName: message }).select("-password").then(userData => {
                        io.to(usernameLowerCase).emit('playerData', userData)
                    })
                    //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                    users[usernameLowerCase] = {
                        socketID: socket.id,
                        username: usernameLowerCase,
                        online: true,
                        chatRooms: []
                    };

                } else {
                    io.to(socket.id).emit('logFail', `${message} is already logged in.`);
                    console.log(`${message} is already in players list. Cannot log in.`);
                }
            }
            // get users current location
            // get northern route from users location
            // get the location of the route
            // send that returned location back to the user
        });

        socket.on('move', ({ message, user }) => {
            console.log("move recieved");
            console.log(message, user);
            // get users current location
            // get northern route from users location
            // get the location of the route
            // send that returned location back to the user
        });

        socket.on('whisper', message => {
            console.log(message);
            let playerTo

            // How this works:
            //   This for loop is going to see if the message received from the user starts with a player name
            //   Because player names are only allowed to be three words max(two spaces),
            //   this for loop iterates through the first three words of the users message starting at 3 and working its way down
            // if at any point in the loop it recognizes a player's name, it will set the playerTo variable to that player's name
            for (let i = 2; i >= 0; i--) {
                const messageString = message.toLowerCase().split(' ').slice(0, i + 1).join(' ');
                players.forEach(player => {
                    if (player === messageString) {
                        playerTo = messageString;
                        message = message.split(' ').slice(i + 1).join(' ');
                    }
                })
            }
            if (playerTo === undefined) {
                io.to(socket.id).emit('error', { status: 404, message: "There is nobody by that name" });
            } else {
                io.to(socket.id).emit('whisperFrom', { message, userTo: playerTo });
                io.to(playerTo).emit('whisperTo', { message, userFrom: playerTo });
            }
        })

        socket.on('stop juggle', () => {

        });

        socket.on('inventory', () => {

        });

        socket.on('speak', () => {

        });

        socket.on('help', () => {
            // db for all the actions/their descriptions and whatnot
            // emit object back to client and parse there
        });

        socket.on('look', () => {
            // db the user's location and emit necessary info
        });

        socket.on('get', () => {
            // idk what the get function is doing tbh 
        });

        socket.on('drop', () => {

        });

        socket.on('wear', () => {

        });

        socket.on('remove', () => {

        });

        socket.on('emote', () => {

        });

        socket.on('juggle', () => {

        });

        socket.on('stats', () => {
            // db for player stats
            // emit stats to player
        });

        socket.on('sleep', () => {

        });

        socket.on('wake', () => {

        });

        socket.on('position', () => {
            //  db for player position
            // emit position to player
        });

    })

}