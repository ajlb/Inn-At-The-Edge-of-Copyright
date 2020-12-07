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
const { validateName, createCharacter } = require("./userInput/userCreation");

// this array is fully temporary and is only here in place of the database until that is set up
let players = [];
let playernicknames = {};

//temp things to simulate display while working on server side only
location = {};




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
            players = players.filter(player => !(player === socket.nickname));
            db.Player.findOneAndUpdate({ characterName: socket.nickname }, { $set: { isOnline: false } }).then(returnData => {
                if (!(returnData === null)){
                    if (!(returnData.lastLocation === null)){
                        io.to(returnData.lastLocation).emit('logout', `${socket.nickname} disappears into the ether.`);
                        getUsers(io, returnData.lastLocation, playernicknames);
                    }
                }
            });
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
                        socket.emit('logFail', `new user`)
                    } else {
                        const userCharacter = returnData.characterName;

                        login(socket, io, userCharacter, players).then(userLocation => {

                            if (!(userLocation === false)) {
                                //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                                socket.nickname = userCharacter;
                                socket.lowerName = userCharacter.toLowerCase();
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
            players = players.filter(player => !(player === socket.nickname));
            db.Player.findOneAndUpdate({ characterName: socket.nickname }, { $set: { isOnline: false } }).then(returnData => {
                if (!(location === null)){
                    io.to(location).emit('logout', `${socket.nickname} disappears into the ether.`);
                    getUsers(io, location, playernicknames);
                }
            });
        })


        /*****************************/
        /*    CREATE NEW CHARACTER   */
        /*****************************/
        socket.on('newUser', ({ input, email }) => {
            validateName(io, socket, input, email).then(success => {
                success && createCharacter(input, email);
            }).then(() => {
                io.to(socket.id).emit('YouCanLogIn');
            })

        })

        /*****************************/
        /*            MOVE           */
        /*****************************/
        socket.on('move', ({ previousLocation, newLocation, direction, user }) => {
            move(socket, io, previousLocation, newLocation, direction, user);
            //leave and enter rooms
            socket.leave(previousLocation);
            getUsers(io, previousLocation, playernicknames);
            socket.join(newLocation);
            getUsers(io, newLocation, playernicknames);
        });


        /*****************************/
        /*          WHISPER          */
        /*****************************/
        socket.on('whisper', ({ message, user }) => {
            console.log(message, user);
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
        socket.on('help', ({ message }) => {
            // db for all the actions/their descriptions and whatnot
            // emit object back to client and parse there
            let emptyMessage = false;
            emptyMessage = (message === undefined) && true;
            emptyMessage = (!emptyMessage && (message.trim() === "")) && true;
            db.Action.find({})
                .then(actionData => {
                    if (emptyMessage) {//just send general help
                        io.to(socket.id).emit('help', { actionData, type: "whole" });
                    } else {
                        const specificHelp = message.trim().toLowerCase();
                        const helpData = {};
                        for (const item of actionData) {
                            if (item.actionName.startsWith(specificHelp)) {
                                helpData["actionName"] = item.actionName;
                                helpData["commandLongDescription"] = item.commandLongDescription;
                                helpData["waysToCall"] = item.waysToCall;
                                helpData["exampleCall"] = item.exampleCall;
                            }
                        }
                        if (helpData["actionName"] === undefined) {
                            io.to(socket.id).emit('failure', `I can't find information on a "${message}" command.`)
                        } else {
                            io.to(socket.id).emit('help', { actionData: helpData, type: "part" });
                        }
                    }
                })

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

            db.Player.find({}).then((statsData) => {
                io.to(socket.id).emit('stats', { statsData });

            })
        });


        /*****************************/
        /*            SLEEP          */
        /*****************************/
        socket.on('sleep', ({ userToSleep, location }) => {
            goToSleep(userToSleep).then(userWasAwake => {
                if (userWasAwake) {
                    io.to(location).emit('sleep', { userToSleep });
                    socket.leave(location);
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
            io.emit('dataRequest', playernicknames) //changed this from users, have not yet changed day/night to reflect this, since day/night is not currently working.
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
            socket.join(message);
        });
    })

}