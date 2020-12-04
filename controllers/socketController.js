const db = require("../models");
const mongoose = require("mongoose");
const { resolveLocationChunk, findLocationData, move } = require("./userInput/move");
const { getItem, dropItem, giveItem } = require("./userInput/getDrop");
const { wearItem, removeItem } = require("./userInput/wearRemove");
const { incrementDex } = require("./userInput/juggle");
const { wakeUp, goToSleep } = require("./userInput/wakeSleep");
const { login, getUsers } = require("./userInput/loginLogout");
const { whisper } = require("./userInput/whisper");
// const { response } = require("express");

const runNPC = require("./NPCEngine");

// this array is fully temporary and is only here in place of the database until that is set up
let players = [];
let users = {};
let playernicknames = {};

//temp things to simulate display while working on server side only
location = {};



//This function is called in logout and disconnect, and remains here due to it editing several of the user variables that live in this file
function removePlayer(socketID, socket, io, playernicknames) {
    return new Promise(function (resolve, reject) {
        for (const user in users) {
            if (users[user].socketID === socketID) {
                io.to(socket.id).emit('logout', "You are now logged off.");
                console.log(users[user].username + " logged off");
                users[user].chatRooms.forEach(room => {
                    socket.leave(room);
                    io.to(room).emit('logout', `${socket.nickname} disappears into the ether.`)
                    getUsers(io, room, playernicknames);
                })
                console.log(players);
                console.log(socket.lowerName);
                players = players.filter(player => !(player === socket.lowerName))
                console.log(players);
                delete users[user];
            }
        }
    })
}




module.exports = function (io) {

    /*****************************/
    /*          CONNECT          */
    /*****************************/
    // this runs only when the user initially connects
    // if the user refreshes their browser, it will disconnect and reconnect them
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected!`);
        // possibly do a DB call to state that the use is online?


        /*****************************/
        /*         DISCONNECT        */
        /*****************************/
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected...`);
            // possibly do a DB call to state that the use is offline?
            //for now just deleting the user
            removePlayer(socket.id, socket, io, playernicknames);
        })


        /*****************************/
        /*           LOG IN          */
        /*****************************/
        socket.on('log in', email => {
            if (email === "You must log in first! Type 'log in [username]'") {
                io.to(socket.id).emit('logFail', email);
            } else {
                db.Player.findOne({ email }).then(returnData => {
                    if (returnData === null) {
                        socket.emit('logFail', `I'm sorry, we have no record of a character with email matching ${email}.`)
                    } else {
                        const userCharacter = returnData.characterName;

                        login(socket, io, userCharacter, players).then(userLocation => {

                            if (!(userLocation === false)) {
                                //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                                socket.nickname = userCharacter;
                                socket.lowerName = userCharacter.toLowerCase();
                                users[socket.lowerName] = {
                                    socketID: socket.id,
                                    nickname: socket.nickname,
                                    lowerName: socket.lowerName,
                                    online: true,
                                    chatRooms: [userLocation]
                                };
                                playernicknames[socket.id] = { nickname: socket.nickname, lowerName: socket.lowerName };

                                getUsers(io, userLocation, playernicknames);

                                //find locations, return initial and then chunk
                                findLocationData(userLocation).then(currentLocationData => {
                                    io.to(socket.lowerName).emit('currentLocation', currentLocationData);
                                    resolveLocationChunk(currentLocationData).then(chunk => {
                                        io.to(socket.lowerName).emit('locationChunk', chunk);
                                        location = chunk;
                                    });

                                })
                            }
                        });
                    }
                })
            }
        });//end socket.on log in


        /*****************************/
        /*           LOGOUT          */
        /*****************************/
        socket.on('logout', location => {
            removePlayer(socket.id, socket, io, playernicknames);

        })


        /*****************************/
        /*            MOVE           */
        /*****************************/
        socket.on('move', ({ previousLocation, newLocation, direction, user }) => {
            move(socket, io, previousLocation, newLocation, direction, user);

            //leave and enter rooms
            socket.leave(previousLocation);
            users[user.toLowerCase()].chatRooms = users[user.toLowerCase()].chatRooms.filter(room => !(room === previousLocation));
            getUsers(io, previousLocation, playernicknames);
            users[user.toLowerCase()].chatRooms.push(newLocation);
            socket.join(newLocation);
            getUsers(io, newLocation, playernicknames);

        });


        /*****************************/
        /*          WHISPER          */
        /*****************************/
        socket.on('whisper', ({ message, user }) => {
            console.log('in socketController');
            console.log("message", message);
            console.log("user", user);
            whisper(socket, io, message, players, user);
        })


        /*****************************/
        /*            NPC            */
        /*****************************/
        socket.on('to NPC', ({ toNPC, message }) => {
            db.Dialog.findOne({ NPC: toNPC }, (err, result) => {
                if (err) throw err;

                runNPC(io, { NPCName: toNPC, NPCObj: result.dialogObj, messageFromUser: message, fromClient: socket.id })

            })
        })

        /*****************************/
        /*   RED - INFO TO USER      */
        /*****************************/
        socket.on('failure', message => {
            io.to(socket.id).emit('failure', message);
        });


        /*****************************/
        /*   GREEN - INFO TO USER    */
        /*****************************/
        socket.on('green', message => {
            io.to(socket.id).emit('green', message);
        });


        /*****************************/
        /*         INVENTORY         */
        /*****************************/
        socket.on('inventory', () => {

        });


        /*****************************/
        /*           SPEAK           */
        /*****************************/
        socket.on('speak', ({ message, user, location }) => {
            io.to(location).emit('speak', `${user}: ${message}`);
        });


        /*****************************/
        /*            HELP           */
        /*****************************/
        socket.on('help', () => {
            // db for all the actions/their descriptions and whatnot
            // emit object back to client and parse there
        });


        /*****************************/
        /*           LOOK            */
        /*****************************/
        socket.on('look', () => {
            // db the user's location and emit necessary info
        });


        /*****************************/
        /*             GET           */
        /*****************************/
        socket.on('get', ({ target, itemId, user, location }) => {
            getItem(socket, io, target, itemId, user, location);
        });


        /*****************************/
        /*           DROP            */
        /*****************************/
        socket.on('drop', ({ target, itemId, user, location }) => {
            dropItem(socket, io, target, itemId, user, location);
        });

        /*****************************/
        /*           WEAR            */
        /*****************************/
        socket.on('wear', ({ user, item, id, targetWords }) => {
            wearItem(io, socket, user, item, id, targetWords);
        });


        /*****************************/
        /*          REMOVE           */
        /*****************************/
        socket.on('remove', ({ user, item, targetSlot }) => {
           removeItem(io, socket, user, item, targetSlot);
        });

        socket.on('emote', ({ user, emotion, location }) => {
            console.log(`${user} ${emotion}`);
            io.to(location).emit('emote', { user, emotion });
        });


        /*****************************/
        /*           JUGGLE          */
        /*****************************/
        //initial juggle message
        socket.on('juggle', ({ target, num, user, location }) => {
            io.to(location).emit('juggle', { user: user.characterName, target, num })
            io.to(user.characterName.toLowerCase()).emit('continueJuggle', { target, num, user, location });

        });

        //juggle every five seconds, with chance of drop
        socket.on('contJuggle', ({ target, num, user, location }) => {
            io.to(location).emit('contJuggle', { user: user.characterName, target, num });
        })

        //stop juggle
        socket.on('stop juggle', ({ user, location, target, intent }) => {
            //user stopped on purpose
            if (intent) {
                io.to(location).emit('stop juggle', { user: user.characterName, roomMessage: `${user.characterName} neatly catches the ${target}, and stops juggling.`, userMessage: `You neatly catch the ${target}, and stop juggling.` });
                //user dropped their items, but got a little better at it
            } else {
                io.to(location).emit('stop juggle', { user: user.characterName, roomMessage: `${user.characterName} drops all the ${target} and scrambles around, picking them up.`, userMessage: `You drop all the ${target} and scramble around, picking them up.` });
                //update player dex
                incrementDex(user.characterName).then(updatedPlayerData => {
                    io.to(user.characterName.toLowerCase()).emit('playerUpdate', updatedPlayerData);
                })
            }
        });


        /*****************************/
        /*            GIVE           */
        /*****************************/
        socket.on('give', ({ target, item, itemId, user, location }) => {
            giveItem(socket, io, target, item, itemId, user, location);
        });


        /*****************************/
        /*           STATS           */
        /*****************************/
        socket.on('stats', () => {
            // db for player stats
            // emit stats to player
        });


        /*****************************/
        /*            SLEEP          */
        /*****************************/
        socket.on('sleep', ({ userToSleep, location }) => {
            goToSleep(userToSleep).then(userWasAwake => {
                if (userWasAwake) {
                    io.to(location).emit('sleep', { userToSleep });
                    socket.leave(location);
                    users[userToSleep.toLowerCase()].chatRooms = users[userToSleep.toLowerCase()].chatRooms.filter(room => !(room === location));
                } else {
                    io.to(socket.id).emit('error', { status: 400, message: "You are already sleeping." });
                }
            });
        });

        /*****************************/
        /*             WAKE          */
        /*****************************/
        socket.on('wake', ({ userToWake, location }) => {
            wakeUp(userToWake).then(userWasSleeping => {
                if (userWasSleeping) {
                    socket.join(location);
                    users[userToWake.toLowerCase()].chatRooms.push(location);
                    io.to(location).emit('wake', { userToWake });
                } else {
                    io.to(socket.id).emit('error', { status: 400, message: "You are already awake." });
                }
            });
        });


        /*****************************/
        /*          POSITION         */
        /*****************************/
        socket.on('position', () => {
            //  db for player position
            // emit position to player
        });




        /*****************************/
        /*        DAY/NIGHT          */
        /*****************************/
        socket.on('dayNight', ({ day, user }) => {
            io.to(user.toLowerCase()).emit('dayNight', day);
        });


        /*****************************/
        /* DAY/NIGHT - DATA REQUEST  */
        /*****************************/
        socket.on('dataRequest', () => {
            io.emit('dataRequest', users)
        });


        /*****************************/
        /* DAY/NIGHT - USER LOCATION */
        /*****************************/
        socket.on('location', (locationData) => {
            io.to('backEngine').emit('location', { locationData, id: socket.id });
        });


        /*****************************/
        /* DAY/NIGHT - USER LOCATION */
        /*****************************/
        socket.on('joinRequest', (message) => {
            console.log('backEngine wants to join backEngine');
            socket.join(message);
        });
    })

}