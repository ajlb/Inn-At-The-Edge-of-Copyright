const db = require("../models");
const mongoose = require("mongoose");


//this pair of functions is for returning async location data within the socket response
const getLocationChunk = async (data) => {
    let locationObject = {};
    locationObject.current = data;
    for (const exit in data.exits) {
        const thisLocation = data.exits[exit];
        locationObject[exit] = await db.Location.findOne({ locationName: thisLocation });
    }
    console.log(locationObject);
    return locationObject;
}
const resolveLocationChunk = (data) => {
    return new Promise((resolve, reject) => {
        console.log('in resolve location chunk');
        resolve(getLocationChunk(data));
    })
}

// this array is fully temporary and is only here in place of the database until that is set up
let players = [];
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
                    console.log(playerIndex);
                    players.splice(playerIndex, 1);
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
                        io.to(userLocation).emit('move', `${message} arrived.`)

                        users[usernameLowerCase].chatRooms.push(userLocation);
                        //find locations, return initial and then chunk
                        db.Location.findOne({ locationName: userLocation }).then(currentLocationData => {

                            io.to(usernameLowerCase).emit('currentLocation', currentLocationData);
                            resolveLocationChunk(currentLocationData).then(chunk => {
                                io.to(usernameLowerCase).emit('locationChunk', chunk);
                                location = chunk;
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
            for (const user in users) {
                if (users[user].socketID === socket.id) {
                    console.log(users[user].username + " logged off");
                    players = players.filter(player => !(player === users[user].username))
                    delete users[user];
                    console.log("user logged out");
                    io.to(socket.id).emit('logout', "You are now logged off.");
                }
            }
        })
        socket.on('move', ({ previousLocation, newLocation, direction, user }) => {


            console.log(`move recieved, direction ${direction}`);
            if (["north", "east", "south", "west"].indexOf(direction) !== -1) {
                io.to(previousLocation).emit('move', `${user} left to the ${direction}.`)
            } else {
                io.to(previousLocation).emit('move', `${user} left to by ${direction}.`)
            }
            //leave and enter rooms
            socket.leave(previousLocation);
            users[user.toLowerCase()].chatRooms = users[user.toLowerCase()].chatRooms.filter(room => !(room === previousLocation));
            users[user.toLowerCase()].chatRooms.push(newLocation);
            socket.join(newLocation);

            io.to(socket.id).emit('yourMove', direction);

            if (["north", "east", "south", "west"].indexOf(direction) !== -1) {
                const switchDirections = { north: "south", east: "west", south: "north", west: "east" };
                direction = switchDirections[direction];
                io.to(newLocation).emit('move', `${user} arrived from the ${direction}.`)
            } else {
                io.to(newLocation).emit('move', `${user} arrived by ${direction}.`)
            }
            console.log("about to set player location");
            console.log(user);
            console.log(newLocation);
            db.Player.updateOne({ characterName: user }, { $set: { lastLocation: newLocation } }).then(data => console.log(data));
            //find locations, return chunk
            db.Location.findOne({ locationName: newLocation }).then(currentLocationData => {

                resolveLocationChunk(currentLocationData).then(chunk => {
                    io.to(socket.id).emit('locationChunk', chunk);
                    location = chunk;
                });

            })
        });

        socket.on('whisper', message => {
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

        socket.on('failure', message => {
            io.to(socket.id).emit('failure', message);
        });

        socket.on('green', message => {
            io.to(socket.id).emit('green', message);
        });

        socket.on('inventory', () => {

        });

        socket.on('speak', ({ message, user, location }) => {
            io.to(location).emit('speak', `${user}: ${message}`);
        });

        socket.on('help', () => {
            // db for all the actions/their descriptions and whatnot
            // emit object back to client and parse there
        });

        socket.on('look', () => {
            // db the user's location and emit necessary info
        });

        socket.on('get', ({ target, user, location }) => {
            console.log(`get ${target} for ${user} from ${location}`);
            db.Location.updateOne({ locationName: location }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": target }] }).then(returnData => {
                console.log('ran scrub Location');
                db.Location.findOneAndUpdate({ locationName: location }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(returnData => {
                    console.log("I should be sending a locationInventoryUpdate");
                    io.to(location).emit('invUpL', returnData.inventory);

                });
            });

            db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": target }] }).then(returnData => {
                if (returnData.nModified === 0) {
                    console.log("got an item that didn't exist in inventory");
                    db.Player.findOneAndUpdate({ characterName: user }, { $push: { inventory: { name: target, quantity: 1, equipped: 0 } } }, { new: true }).then(returnData => {
                        console.log("I should be sending a playerInventoryUpdate");
                        io.to(socket.id).emit('invUpP', returnData.inventory);
                    });
                } else {
                    db.Player.findOne({ characterName: user }).then(returnData => {
                        console.log("I should be sending a playerInventoryUpdate");
                        io.to(socket.id).emit('invUpP', returnData.inventory);
                    })
                }
                io.to(location).emit('get', { target, actor: user });

            })
        });

        socket.on('drop', ({ target, user, location }) => {
            console.log(`drop ${target} from ${user} to ${location}.`);

            db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": target }] }).then(returnData => {
                console.log('ran scrub player');
                db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(returnData => {
                    console.log(returnData);
                    console.log("I should be sending a playerInventoryUpdate");
                    io.to(socket.id).emit('invUpP', returnData.inventory);
                });
            });

            db.Location.updateOne({ locationName: location }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": target }] }).then(returnData => {
                console.log("This is the location data:");
                console.log(returnData);
                if (returnData.nModified === 0) {
                    console.log("dropped an item that didn't exist in location");
                    db.Location.findOneAndUpdate({ locationName: location }, { $push: { inventory: { name: target, quantity: 1 } } }, { new: true }).then(returnData => {
                        console.log(returnData);
                        console.log("I should be sending a locationInventoryUpdate");
                        io.to(location).emit('invUpL', returnData.inventory);

                    });
                } else {
                    db.Location.findOne({ locationName: location }).then(returnData => {
                        console.log("I should be sending a locationInventoryUpdate");
                        io.to(location).emit('invUpL', returnData.inventory);
                    })
                }
                io.to(location).emit('drop', { target, actor: user });

            })





        });

        socket.on('wear', () => {

        });

        socket.on('remove', () => {

        });

        socket.on('emote', () => {

        });

        socket.on('juggle', ({ target, num, user, location }) => {
            console.log(`${user.characterName} juggles ${num} ${target}`);
            io.to(location).emit('juggle', { user: user.characterName, target, num })
            io.to(user.characterName.toLowerCase()).emit('continueJuggle', { target, num, user, location });

        });

        socket.on('contJuggle', ({ target, num, user, location }) => {
            io.to(location).emit('contJuggle', { user: user.characterName, target, num });
        })


        socket.on('stop juggle', ({ user, location, target, intent }) => {
            console.log('received stop juggle');
            console.log(intent);
            console.log(location);
            if (intent) {
                io.to(location).emit('stop juggle', { user: user.characterName, roomMessage: `${user.characterName} neatly catches the ${target}, and stops juggling.`, userMessage: `You neatly catch the ${target}, and stop juggling.` });
            } else {
                io.to(location).emit('stop juggle', { user: user.characterName, roomMessage: `${user.characterName} drops all the ${target} and scrambles around, picking them up.`, userMessage: `You drop all the ${target} and scramble around, picking them up.` });

            }
        });

        socket.on('give', ({ target, item, user, location }) => {
            console.log(`give ${target} from ${user} to ${target}.`);

            db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(returnData => {
                console.log('ran scrub player');
                db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(returnData => {
                    console.log(returnData);
                    console.log("I should be sending a playerInventoryUpdate");
                    io.to(socket.id).emit('invUpP', returnData.inventory);
                });
            });

            db.Player.updateOne({ characterName: target }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(returnData => {
                console.log("This is the target player data:");
                console.log(returnData);
                if (returnData.nModified === 0) {
                    console.log(`gave an item to ${target} that they didn't have`);
                    db.Player.findOneAndUpdate({ characterName: target }, { $push: { inventory: { name: item, quantity: 1 } } }, { new: true }).then(returnData => {
                        console.log(returnData);
                        console.log("I should be sending a playerInventoryUpdate");
                        io.to(target.toLowerCase()).emit('invUpP', returnData.inventory);

                    });
                } else {
                    db.Player.findOne({ characterName: target }).then(returnData => {
                        console.log("I should be sending a playerInventoryUpdate");
                        io.to(target.toLowerCase()).emit('invUpP', returnData.inventory);
                    })
                }
                io.to(location).emit('give', { target, item, actor: user });

            });
        });

        socket.on('stats', () => {
            // db for player stats
            // emit stats to player
        });

        socket.on('sleep', ({ userToSleep }) => {
            db.Player.findOneAndUpdate({ characterName: userToSleep }, { $set: { isAwake: false } }, (err, playerData) => {
                if (err) throw err;

                if (!playerData.isAwake) {
                    io.to(socket.id).emit('error', { status: 400, message: "You are already sleeping" });
                } else {
                    io.to(socket.id).emit('sleep', { userToSleep })
                }
            })
        });

        socket.on('wake', () => {

        });

        socket.on('position', () => {
            //  db for player position
            // emit position to player
        });

    })

}