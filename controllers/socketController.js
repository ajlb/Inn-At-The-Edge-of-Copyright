const db = require("../models");
const mongoose = require("mongoose");
const { resolveLocationChunk, findLocationData, move } = require("./userInput/move");
const { getItem, dropItem, giveItem } = require("./userInput/getDrop");
const { wearItem, removeItem } = require("./userInput/wearRemove");
const { incrementDex } = require("./userInput/statINC");
const { wakeUp, goToSleep } = require("./userInput/wakeSleep");
const { login, getUsers } = require("./userInput/loginLogout");
const { whisper } = require("./userInput/whisper");
const { receiveAttack, wakeMonstersOnMove, sleepMonstersOnMove } = require("./fighting");
const runNPC = require("./NPCEngine");
const runDiscoverable = require('./discoverables')
const { validateName, createCharacter } = require("./userInput/userCreation");
const { eatItem } = require("./userInput/eat");
const runSweep = require("./sweeper");
const { repopMobs } = require("./monsterSweeper");
const dayNight = require("./dayNight");

// this array is fully temporary and is only here in place of the database until that is set up
let players = [];
let playernicknames = {};

//temp things to simulate display while working on server side only
location = {};

//how often do we sweep the rooms
let itemSweeperInterval;
//how often do we repop the mobs
let monsterSweeperInterval;
//make sure we only run day/Night once
let isDayNightRunning = false;



module.exports = function (io) {

    /*****************************/
    /*          CONNECT          */
    /*****************************/
    // this runs only when the user initially connects
    // if the user refreshes their browser, it will disconnect and reconnect them
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected!`);
        // possibly do a DB call to state that the use is online?
        io.to(socket.id).emit('data request');
        io.to(socket.id).emit('locationRequest');


        /*****************************/
        /*         DISCONNECT        */
        /*****************************/
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected...`);
            players = players.filter(player => !(player === socket.nickname));
            delete playernicknames[socket.id];
            db.Player.findOneAndUpdate({ characterName: socket.nickname }, { $set: { isOnline: false, isAwake: true } }, { new: true })
                .then(returnData => {
                    // console.log("isAwake on disconnect:", returnData.isAwake)
                    if (!(returnData === null)) {
                        if (!(returnData.lastLocation === null)) {
                            io.to(returnData.lastLocation).emit('logout', { user: socket.nickname, message: `${socket.nickname} disappears into the ether.` });
                            getUsers(io, returnData.lastLocation, playernicknames);
                        }
                    }
                })
                .catch(e => {
                    console.log(e)
                });
        })


        /*****************************/
        /*           LOG IN          */
        /*****************************/
        socket.on('log in', email => {
            if (email === "You must log in first! Type 'log in [username]'") {
                io.to(socket.id).emit('logFail', email);
            } else {
                db.Player.findOne({ email })
                    .then(returnData => {
                        if (returnData === null) {
                            socket.emit('logFail', `new user`)
                        } else {
                            const userCharacter = returnData.characterName;

                            login(socket, io, userCharacter, players).then(async (userLocation) => {

                                if (!(userLocation === false)) {
                                    //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                                    socket.nickname = userCharacter;
                                    socket.lowerName = userCharacter.toLowerCase();
                                    if (!playernicknames[socket.id]){
                                        playernicknames[socket.id] = { nickname: socket.nickname, lowerName: socket.lowerName };
                                    } else {
                                        playernicknames[socket.id].nickname = socket.nickname;
                                        playernicknames[socket.id].lowerName = socket.lowerName;
                                    }

                                    io.to(socket.id).emit('locationRequest');
                                    await getUsers(io, userLocation, playernicknames);

                                    //find locations, return initial and then chunk
                                    findLocationData(userLocation)
                                        .then(currentLocationData => {
                                            io.to(socket.lowerName).emit('currentLocation', currentLocationData);
                                            resolveLocationChunk(currentLocationData)
                                                .then(chunk => {
                                                    if (chunk !== null) {
                                                        io.to(socket.lowerName).emit('locationChunk', chunk);
                                                        location = chunk;
                                                    } else {
                                                        io.to(socket.lowerName).emit('error', { status: '500', message: "Something went wrong" })
                                                    }
                                                })
                                                .catch(e => {
                                                    console.log(e)
                                                });

                                        })
                                        .catch(e => {
                                            console.log(e)
                                        })
                                }
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        });//end socket.on log in


        /*****************************/
        /*           LOGOUT          */
        /*****************************/
        socket.on('logout', location => {
            players = players.filter(player => !(player === socket.nickname));
            db.Player.findOneAndUpdate({ characterName: socket.nickname }, { $set: { isOnline: false } }).then(returnData => {
                if (!(location === null)) {
                    io.to(location).emit('logout', { user: socket.nickname, message: `${socket.nickname} disappears into the ether.` });
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
        /*    ADD PLAYER TO ROSTER   */
        /*****************************/
        socket.on('add player', ({ player }) => {
            console.log(`${player.characterName} reconnected`)
            players.push(player.characterName);
            socket.join(player.characterNameLowerCase)
            let userLocation = player.lastLocation;
            let userCharacter = player.characterName;
            if (!(userLocation === false)) {
                //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                socket.join(userLocation)
                socket.nickname = userCharacter;
                socket.lowerName = userCharacter.toLowerCase();
                playernicknames[socket.id] = { nickname: socket.nickname, lowerName: socket.lowerName };
                getUsers(io, userLocation, playernicknames);

                db.Player.findOneAndUpdate({ characterName: userCharacter }, { $set: { isAwake: player.isAwake, isOnline: true } }, { new: true })
                    .then(playerData => {
                        // console.log("isAwake on reconnect:", playerData.isAwake)
                    })
                    .catch(e => {
                        console.log(e)
                    })

                //find locations, return initial and then chunk
                findLocationData(userLocation)
                    .then(currentLocationData => {
                        io.to(socket.lowerName).emit('currentLocation', currentLocationData);
                        resolveLocationChunk(currentLocationData)
                            .then(chunk => {
                                if (chunk !== null) {
                                    io.to(socket.lowerName).emit('locationChunk', chunk);
                                    location = chunk;
                                } else {
                                    io.to(socket.lowerName).emit('error', { status: '500', message: "Something went wrong" })
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            });

                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        })


        /*****************************/
        /*        DISCOVERABLE       */
        /*****************************/
        socket.on('discoverable', (props) => {
            props["socket"] = socket;
            props["io"] = io;
            runDiscoverable(props);
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
            wakeMonstersOnMove(newLocation);
            getUsers(io, newLocation, playernicknames);
        });


        /*****************************/
        /*          WHISPER          */
        /*****************************/
        socket.on('whisper', ({ message, userData }) => {
            whisper(socket, io, message, players, userData);
        })


        /*****************************/
        /*            NPC            */
        /*****************************/
        socket.on('to NPC', ({ toNPC, message, user }) => {
            db.Dialog.findOne({ NPC: toNPC })
                .then((result) => {
                    if (result) {
                        runNPC(io, { socket, user, NPCName: toNPC, NPCObj: result.dialogObj, messageFromUser: message, fromClient: socket.id })
                    } else {
                        socket.emit('failure', `Looks like ${toNPC} has nothing to say to you`)
                    }
                })
                .catch(e => {
                    socket.emit('errror', { status: 500, message: `Something went wrong` });
                    console.log(`Error in 'to NPC' listener: `, e)
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


        /*****************************/
        /*           SPEAK           */
        /*****************************/
        socket.on('speak', ({ message, user, location }) => {
            io.to(location).emit('speak', `${user}: ${message}`);
        });


        /*****************************/
        /*           SHOUT           */
        /*****************************/
        socket.on('shout', ({ message, fromUser, location }) => {
            console.log(`${fromUser} shouts to ${location}: ${message}`)
            db.Location.findOne({ locationName: location })
                .then(locationData => {
                    if (locationData && locationData !== {}) {
                        db.Location.find({ region: locationData.region })
                            .then(locationsArray => {
                                if (locationsArray && locationsArray.length > 0) {
                                    locationsArray.forEach(locationObj => {
                                        let userMessage = `<span className='text-red'>${fromUser} shouts:</span> ${message}`
                                        io.to(locationObj.locationName).emit('shout', { userMessage, fromUser })
                                    })
                                } else {
                                    io.to(socket.id).emit("failure", "Something went wrong");
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            })
                    } else {
                        io.to(socket.id).emit('failure', "Something went wrong")
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            // io.to(location).emit('speak', `${user}: ${message}`);
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
                .catch(e => {
                    console.log(e)
                })

        });


        /*****************************/
        /*           LOOK            */
        /*****************************/
        // 404 Look not found


        /*****************************/
        /*             GET           */
        /*****************************/
        socket.on('get', ({ target, itemId, user, location }) => {
            getItem(socket, io, target, itemId, user, location);
        });


        /*****************************/
        /*             EAT           */
        /*****************************/
        socket.on('eat', ({ target, itemId, player, locationName }) => {
            eatItem(socket, io, target, itemId, player, locationName);
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
            console.log(user, "stops juggling");
            //user stopped on purpose
            if (intent) {
                io.to(location).emit('stop juggle', { actor: user, roomMessage: `${user} neatly catches the ${target}, and stops juggling.`, userMessage: `You neatly catch the ${target}, and stop juggling.` });
                //user dropped their items, but got a little better at it
            } else {
                io.to(location).emit('stop juggle', { actor: user, roomMessage: `${user} drops all the ${target} and scrambles around, picking them up.`, userMessage: `You drop all the ${target} and scramble around, picking them up.` });
                //update player dex
                incrementDex(user).then(updatedPlayerData => {
                    io.to(user.toLowerCase()).emit('playerUpdate', updatedPlayerData);
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

            db.Player.find({})
                .then((statsData) => {
                    if (statsData !== null) {
                        io.to(socket.id).emit('stats', { statsData });
                    } else {
                        io.emit('error', { status: 500, message: "Something went wrong" })
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        });


        /*****************************/
        /*            SLEEP          */
        /*****************************/
        socket.on('sleep', ({ userToSleep, location }) => {
            goToSleep(io, socket, userToSleep).then(userWasAwake => {
                if (userWasAwake) {
                    io.to(location).emit('sleep', { userToSleep });
                } else {
                    io.to(socket.id).emit('error', { message: "You are already sleeping" });
                    io.to(socket.id).emit('sleep', { userToSleep, quiet: true });
                }
                socket.leave(location);
            });
        });

        /*****************************/
        /*             WAKE          */
        /*****************************/
        socket.on('wake', ({ userToWake, location }) => {
            wakeUp(io, socket, userToWake).then(userWasAsleep => {
                socket.join(location);
                if (userWasAsleep) {
                    io.to(location).emit('wake', { userToWake });
                } else {
                    io.to(socket.id).emit('error', { message: "You are already awake!" });
                    io.to(socket.id).emit('wake', { userToWake, quiet: true });
                }
            });
        });


        /*****************************/
        /*          POSITION         */
        /*****************************/


        /*****************************/
        /*           ATTACK          */
        /*****************************/
        socket.on('attackCreature', ({ target, user, location }) => {
            console.log(`${target.name} is being attacked by ${user.characterName} in the ${location.locationName}.`);
            receiveAttack(io, socket, target, user, location);
        })

        /*****************************/
        /*   DAY/NIGHT - SEND DATA   */
        /*****************************/
        socket.on('dayNight', ({ day, user }) => {
            io.to(user.toLowerCase()).emit('dayNight', day);
        });


        /*****************************/
        /* DAY/NIGHT - USER LOCATION */
        /*****************************/
        socket.on('location', (locationData) => {
            // console.log("location:", socket.id);
            // console.log(locationData);
            if (!playernicknames[socket.id]){
                playernicknames[socket.id] = { nickname: socket.nickname, lowerName: socket.lowerName }
            }
            playernicknames[socket.id].latitude = locationData.latitude
            playernicknames[socket.id].longitude = locationData.longitude

            // console.log(playernicknames[socket.id]);
        });


        /*****************************/
        /* DAY/NIGHT - RUN FUNCTION  */
        /*****************************/
        if (!isDayNightRunning){
            dayNight(io, socket, playernicknames);
            isDayNightRunning = true;
        }


        /*****************************/
        /*          SWEEPERS         */
        /*****************************/

        if( itemSweeperInterval === undefined ){
            itemSweeperInterval = setInterval(function () {
                runSweep(io, socket);
            }, 600000)
        }

        if (monsterSweeperInterval === undefined){
            monsterSweeperInterval = setInterval(function () {
                repopMobs(io, socket);
            }, 120000)
        }
    })

}