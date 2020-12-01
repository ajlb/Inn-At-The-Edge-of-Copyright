const db = require("../models");
const mongoose = require("mongoose");
const { resolveLocationChunk, findLocationData, move } = require("./userInput/move");
const { findPlayerData, getItem, dropItem, giveItem } = require("./userInput/getDrop");
const { findItem } = require("./userInput/wearRemove");
const { incrementDex } = require("./userInput/juggle");
const { wakeUp, goToSleep } = require("./userInput/wakeSleep");
const { login } = require("./userInput/loginLogout");
const { whisper } = require("./userInput/whisper");
const runNPC = require("./NPCEngine");

// this array is fully temporary and is only here in place of the database until that is set up
let players = [];
let users = {};
let playerNickNames = {};

//temp things to simulate display while working on server side only
location = {};


module.exports = function (io) {
    function removePlayer(socketID) {
        return new Promise(function (resolve, reject) {
            for (const user in users) {
                if (users[user].socketID === socketID) {
                    console.log(users[user].username + " logged off");
                    players = players.filter(player => !(player === users[user].username))
                    delete users[user];
                }
            }
        })
    }


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
            removePlayer(socket.id);
        })


        /*****************************/
        /*           LOG IN          */
        /*****************************/
        socket.on('log in', message => {
            login(socket, io, message, players).then(userLocation => {
                if (!(userLocation === false)) {
                    //for now I'm just creating user info and putting them in the general game user array (the general user array won't be necessary once Auth is in place)
                    socket.nickName = message;
                    socket.lowerName = message.toLowerCase();
                    users[message.toLowerCase()] = {
                        socketID: socket.id,
                        username: message.toLowerCase(),
                        online: true,
                        chatRooms: [userLocation]
                    };
                    playerNickNames[socket.id] = {nickname: socket.nickName, lowerName: socket.lowerName};

                    let roster = io.sockets.adapter.rooms;
                    console.log("roster");
                    console.log(roster);
                    console.log('roster[userLocation]:');
                    roomUsers = roster.get(userLocation);
                    console.log(roster.get(userLocation));
                    // console.log(roomUsers.keys().forEach((key)=>{
                    //     console.log(io.sockets.adapter.connected[key].nickName);
                    // }));
                    console.log('roomUsers');
                    console.log(roomUsers.keys());
                    for (const socketID of roomUsers.keys()) {
                        console.log(playerNickNames[socketID]);
                        // do stuff with nickname
                      }

                    //find locations, return initial and then chunk
                    findLocationData(userLocation).then(currentLocationData => {
                        io.to(message.toLowerCase()).emit('currentLocation', currentLocationData);
                        resolveLocationChunk(currentLocationData).then(chunk => {
                            io.to(message.toLowerCase()).emit('locationChunk', chunk);
                            location = chunk;
                        });

                    })
                }
            });
        });//end socket.on log in


        /*****************************/
        /*           LOGOUT          */
        /*****************************/
        socket.on('logout', message => {
            removePlayer(socket.id);
            io.to(socket.id).emit('logout', "You are now logged off.");
        })


        /*****************************/
        /*            MOVE           */
        /*****************************/
        socket.on('move', ({ previousLocation, newLocation, direction, user }) => {
            move(socket, io, previousLocation, newLocation, direction, user);

            //leave and enter rooms
            socket.leave(previousLocation);
            users[user.toLowerCase()].chatRooms = users[user.toLowerCase()].chatRooms.filter(room => !(room === previousLocation));
            users[user.toLowerCase()].chatRooms.push(newLocation);
            socket.join(newLocation);

        });


        /*****************************/
        /*          WHISPER          */
        /*****************************/
        socket.on('whisper', ({message, user}) => {
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
        socket.on('get', ({ target, user, location }) => {
            getItem(socket, io, target, user, location);
        });


        /*****************************/
        /*           DROP            */
        /*****************************/
        socket.on('drop', ({ target, user, location }) => {
            dropItem(socket, io, target, user, location);
        });


        /*****************************/
        /*            WEAR           */
        /*****************************/
        socket.on('wear', ({ user, item, targetWords }) => {
            const targetSlot = targetWords ? targetWords.replace(/\s/g, "").toLowerCase() : false;
            //find item info
            findItem(item).then(returnData => {
                if (returnData.equippable.length === 1) {
                    let slot = returnData.equippable[0]
                    //return info about what the user is already wearing
                    findPlayerData(user).then(returnData => {
                        if (returnData.wornItems[slot] === null) {
                            //let user wear item if they are not already wearing something there
                            db.Player.findOneAndUpdate({ characterName: user }, { $set: { [`wornItems.${slot}`]: item } }, { new: true }).then(returnData => {
                                db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(returnData => {
                                    db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(finalData => {
                                        io.to(socket.id).emit('playerUpdate', finalData);
                                    });
                                });
                                io.to(user.toLowerCase()).emit('wear', `You wear your ${item} on your ${slot.slice(0, -4)}.`);
                            })
                        } else {
                            //failure message on no empty space to wear item
                            io.to(user.toLowerCase()).emit('failure', `You'll need to remove the ${returnData.wornItems[slot]} from your ${slot.slice(0, -4)} before you can wear the ${item}.`);
                        }
                    })
                } else if (returnData.equippable.length > 1) {
                    //there are multiple slot options
                    const options = returnData.equippable.map(slot => {
                        slot = slot.slice(0, -4);
                        switch (slot) {
                            case "rightHand":
                                slot = "right hand";
                                break;
                            case "leftHand":
                                slot = "left hand";
                                break;
                            case "twoHands":
                                slot = "two hands";
                                break;
                            default:
                                break;
                        }
                        return slot;
                    })
                    const uneditedSlots = returnData.equippable;
                    //only wear on matching slot
                    if (targetWords) {
                        let worn = false;
                        for (const editedSlot of options) {
                            if (editedSlot === targetWords.toLowerCase()) {
                                let slotIndex = options.indexOf(editedSlot);
                                worn = true;
                                db.Player.findOne({ characterName: user }).then(returnData => {
                                    //If player's matching equipment slot is empty
                                    if (returnData.wornItems[uneditedSlots[slotIndex]] === null) {
                                        db.Player.updateOne({ characterName: user }, { $set: { [`wornItems.${uneditedSlots[slotIndex]}`]: item } }).then(returnData => {
                                            db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": -1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(incrementData => {
                                                db.Player.findOneAndUpdate({ characterName: user }, { $pull: { "inventory": { "quantity": { $lt: 1 } } } }, { new: true }).then(finalData => {
                                                    io.to(user.toLowerCase()).emit('wear', `You wear your ${item} on your ${editedSlot}.`);
                                                    io.to(user.toLowerCase()).emit('playerUpdate', finalData);
                                                })
                                            })
                                        })
                                        //if player's matching equipment slot is full
                                    } else {
                                        io.to(user.toLowerCase()).emit('failure', `You'll need to remove the ${returnData.wornItems[uneditedSlots[slotIndex]]} from your ${editedSlot} before you can wear the ${item}.`);
                                    }
                                })
                            }
                        }
                        if (!worn) {//if user didn't put in a matching slot
                            io.to(user.toLowerCase()).emit('green', `You can't wear that item there.`);
                        }
                    } else {//if multiple slots but user didn't specify
                        io.to(user.toLowerCase()).emit('green', `Where do you want to wear it? (${options.join(", ")})`);
                    }
                } else {//non wearable item
                    io.to(user.toLowerCase()).emit('green', `You can't wear that.`);
                }
            })

        });


        /*****************************/
        /*          REMOVE           */
        /*****************************/
        socket.on('remove', ({ user, item, targetSlot }) => {
            switch (targetSlot) {
                case "lefthand":
                    targetSlot = "leftHand";
                    break;
                case "righthand":
                    targetSlot = "rightHand";
                    break;
                case "twohands":
                    targetSlot = "twoHands";
                    break;
                default:
                    break;
            }
            //empty player's equipment slot
            db.Player.updateOne({ characterName: user }, { $set: { [`wornItems.${targetSlot}`]: null } }).then(returnData => {
                //only add item to inventory if the empty goes through
                if (returnData.nModified === 1) {
                    db.Player.updateOne({ characterName: user }, { $inc: { "inventory.$[item].quantity": 1 } }, { upsert: true, arrayFilters: [{ "item.name": item }] }).then(returnData => {
                        targetSlot = targetSlot.slice(0, -4).toLowerCase();
                        switch (targetSlot) {
                            case "lefthand":
                                targetSlot = "left hand";
                                break;
                            case "righthand":
                                targetSlot = "right hand";
                                break;
                            case "twohands":
                                targetSlot = "two hands";
                                break;
                            default:
                                break;
                        }
                        //if increment succeeded, there was already one there
                        if (returnData.nModified === 1) {
                            //send success
                            db.Player.findOne({ characterName: user }).then(returnData => {
                                io.to(socket.id).emit('playerUpdate', returnData);
                            })
                            io.to(socket.id).emit('remove', `You remove your ${item} from your ${targetSlot}.`);
                            //if increment failed, add a new entry to inventory
                        } else {
                            db.Player.findOneAndUpdate({ characterName: user }, { $push: { inventory: { name: item, quantity: 1 } } }, { new: true }).then(returnData => {
                                //send success
                                io.to(socket.id).emit('remove', `You remove your ${item} from your ${targetSlot}.`);
                                io.to(socket.id).emit('playerUpdate', returnData);
                            })
                        }
                    })
                }
            })

        });


        /*****************************/
        /*           EMOTE           */
        /*****************************/
        socket.on('emote', () => {

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
        socket.on('give', ({ target, item, user, location }) => {
            giveItem(socket, io, target, item, user, location);
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

    })

}