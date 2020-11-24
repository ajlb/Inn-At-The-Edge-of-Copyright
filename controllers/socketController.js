const db = require("../models");
const mongoose = require("mongoose");


//this pair of functions is for returning async location data within the socket response
const getLocationChunk = async (data) => {
    let locationObject = {};
    locationObject.current = data;
    for (const exitObject of locationObject.current.exits) {
        const key = Object.keys(exitObject)[0];
        locationObject[key] = await db.Location.findOne({ locationName: exitObject[key] });
    }
    return locationObject;
}
const resolveLocationChunk = (data) => {
    return new Promise((resolve, reject) => {
        resolve(getLocationChunk(data));
    })
}

// this array is fully temporary and is only here in place of the database until that is set up
let players = ['the mando', 'shambles', 'cosmo the magnificent'];
let users = {};

//temp things to simulate display while working on server side only
location = {};

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
                    db.Player.findOne({ characterName: message }).select("-password").then(userData => {
                        let userLocation
                        if (userData === null) {
                            userLocation = "Inn Lobby";
                        } else {
                            userLocation = userData.lastLocation;
                        }
                        io.to(usernameLowerCase).emit('playerData', userData)
                        socket.join(userLocation);
                        users[usernameLowerCase].chatRooms.push(userLocation);
                        //find locations, return initial and then chunk
                        db.Location.findOne({ locationName: userLocation }).then(currentLocationData => {

                            io.to(usernameLowerCase).emit('currentLocation', currentLocationData);
                            resolveLocationChunk(currentLocationData).then(chunk => {
                                io.to(usernameLowerCase).emit('locationChunk', chunk);
                                location = chunk;
                                console.log(chunk.current.dayDescription);
                            });

                        })
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
        });//end socket.on log in

        socket.on('logout', message => {
            for (const user in users){
                if (users[user].socketID === socket.id){
                    const playersIndex = players.indexOf(user.username);
                    players = players.splice(playersIndex, 1);
                    delete users[user];
                    console.log("user logged out");
                    io.to(socket.id).emit('logout', "You are now logged off.");
                }
            }
        })
        socket.on('move', ({ message, user }) => {
            console.log("move recieved");
            const currentExits = [];
            for (const exitObj of location.current.exits){
                const key = Object.keys(exitObj)[0];
                if (key.startsWith("exit")){
                    currentExits.push(key.slice(4));
                } else {
                    currentExits.push(key);
                }
            }
            console.log(currentExits);
            console.log(`user leaves to the`);
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