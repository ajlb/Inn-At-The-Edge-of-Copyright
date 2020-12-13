const { christmasJelloFactory } = require("./monsters");
const db = require("../models");
const mongoose = require("mongoose");
const { roll } = require("./userInput/characterLeveling");
const { incrementDexAndStrAndXP } = require("./userInput/statINC");
const { pushItemToInventoryReturnData, incrementItemUpdateOne } = require("./userInput/getDrop");
const { findLocationData} = require("./userInput/move");
const VOWELS = ["a", "e", "i", "o", "u"];
console.log("++++++++++++++++++ LOGGING THIS FUNCTION +++++++++++++++++");
console.log(findLocationData);


function random9DigitNumber() {
    let numberString = "";
    for (i = 0; i < 9; i++) {
        numberString += Math.floor(Math.random() * 10);
    }
    return parseInt(numberString);
}


//to do:
//set timer to have jello fight back
//set disengage reminder at half health or below 5


let activeMonsters = {};

function getStatIncreaseFromMonsterKill(monsterObject, player) {
    return (monsterObject.stats.maxHP / ((player.stats.maxHP * 2) + 10));
}

function getItemIdFromName(itemName) {
    return new Promise((resolve, reject) => {
        db.Item.findOne({ itemName }).then(data => {
            resolve(data._id);
        }).catch(e => {
            console.log("DB CATCH FROM getItemIdFromName:");
            console.log(e);
            reject(e);
        })
    })
}

async function awakenMonsters(monsterObject) {
    console.log("inside awakenMonsters");
    console.log(monsterObject);
    try {
        let thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        switch (monsterObject.name) {
            case "Christmas Jello":
                activeMonsters[`${monsterObject.name} ${monsterObject.id}`] = thisMonster ? thisMonster : await christmasJelloFactory(monsterObject.id);
                thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
                console.log('ACTIVE MONSTERS');
                console.log(activeMonsters);
                break;

            default:
                break;
        }
    } catch (e) {
        console.log("ERROR FROM awakenMonsters");
        console.log(e);
    }
}

async function sleepMonsters(monsterObject) {
    console.log("inside sleepMonsters");
    try {
        let thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        if (thisMonster) {
            delete activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        }
        console.log("ACTIVE MONSTERS AFTER SLEEP");
        console.log(activeMonsters);
    } catch (e) {
        console.log("ERROR FROM sleepMonsters");
        console.log(e);
    }
}


const wakeMonstersOnMove = async (location) => {
    try {
        locationData = await db.Location.findOne({locationName: location}).catch(e=>console.log(e));
        fightables = locationData.fightables;
        if (fightables.length > 0){
            for (const monsterObject of fightables){
                awakenMonsters(monsterObject);
            }
        }
    } catch (e) {
        console.log("ERROR FROM wakeMonstersOnMove");
        console.log(e);
    }
}

const sleepMonstersOnMove = async (location) => {
    try {
        locationData = await db.Location.findOne({locationName: location}).catch(e=>console.log(e));
        fightables = locationData.fightables;
        if (fightables.length > 0){
            for (const monsterObject of fightables){
                sleepMonsters(monsterObject);
            }
        }
    } catch (e) {
        console.log("ERROR FROM sleepMonstersOnMove");
        console.log(e);
    }
}

function updateAndDisseminateFightables({ io, singleLocationChunk, monsterObject, isAlive = null, isFighting }) {
    try {
        if (!(isAlive === null) && !(isFighting === null)) {
            db.Location.findOneAndUpdate(
                { locationName: singleLocationChunk.locationName },
                { $set: { "fightables.$[mob].isFighting": isFighting, "fightables.$[mob].isAlive": isAlive } },
                { arrayFilters: [{ "mob.id": monsterObject.id }], new: true })
                .populate('inventory.item')
                .then(returnData => {
                    //send location update to anyone with that location in their locationChunk
                    if (returnData) {
                        console.log(`sending location update to ${returnData.locationName}`);
                        io.to(singleLocationChunk.locationName).emit('updateFightables', { data: returnData, targetLocation: returnData.locationName });
                        console.log(returnData);
                        for (const param in returnData.exits) {
                            io.to(returnData[param]).emit('updateFightables', { data: returnData, targetLocation: returnData.locationName });
                        }
                    }
                }).catch(e => console.log(e));
        } else if (!(isFighting === null)) {
            db.Location.findOneAndUpdate(
                { locationName: singleLocationChunk.locationName },
                { $set: { "fightables.$[mob].isFighting": isFighting } },
                { arrayFilters: [{ "mob.id": monsterObject.id }], new: true })
                .populate('inventory.item')
                .then(returnData => {
                    //send location update to anyone with that location in their locationChunk
                    if (returnData) {
                        io.to(singleLocationChunk.locationName).emit('updateFightables', { fightables: returnData.fightables, targetLocation: returnData.locationName });
                        console.log(returnData);
                        for (const param in returnData.exits) {
                            io.to(returnData[param]).emit('updateFightables', { fightables: returnData.fightables, targetLocation: returnData.locationName });
                        }
                    }
                }).catch(e => console.log(e));
        }
    } catch (e) {
        console.log("ERROR FROM updateAndDisseminateFightables:");
        console.log(e);
    }
}


//put "a" before consonants and y, put "an" before vowels
function insertArticleSingleValue(value) {
    if (doesThisStartWithOneOfThese(value, VOWELS)) {
        return `an ${value}`;
    } else {
        return `a ${value}`;
    }
}

//determine if a string begins with any of an array of other strings
function doesThisStartWithOneOfThese(givenString, givenArray) {
    if (givenArray === undefined) {
      return false;
    }
    // console.log("givenString: ", givenString)
    // console.log("givenArray: ", givenArray)
    for (let value of givenArray) {
      if (givenString.toLowerCase().startsWith(value + ' ') && (value.length > 1) || givenString.toLowerCase() === value) {
        return true
      }
    }
    return false
  }


async function dropItemFromMonster(io, monsterObject, locationName) {
    try {
        console.log(monsterObject.drop);
        for (const item of monsterObject.drop) {
            getItemIdFromName(item).then(itemId => {
                console.log(`${monsterObject.name} drops ${item}, id ${itemId}`);
                incrementItemUpdateOne(itemId, locationName, "location").then(incData => {
                    if (!incData) {
                        pushItemToInventoryReturnData(itemId, locationName, "location").then(pushData => {
                            if (pushData === null) {
                                console.log("couldn't push drop item to location inventory");
                                return false;
                            } else {
                                io.to(locationName).emit('invUpL', pushData.inventory);
                                io.to(locationName).emit('genericMessage', `${monsterObject.name} dissolves, leaving behind ${insertArticleSingleValue(item)}.`)
                            }
                        })
                    } else {
                        console.log(findLocationData);
                        findLocationData(locationName).then(locationData => {
                            if (locationData === null) {
                                console.log("couldn't find location to give item to");
                                return false;
                            } else {
                                io.to(locationName).emit('invUpL', locationData.inventory);
                                io.to(locationName).emit('genericMessage', `${monsterObject.name} dissolves, leaving behind ${insertArticleSingleValue(item)}.`);

                            }
                        })
                    }
                })
            })
        }
    } catch (e) {
        console.log("ERROR FROM dropItemFromMonster:");
        console.log(e);
    }
}

async function processPlayerAttack(user, monster) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log("MONSTER FROM PROCESS PLAYER");
            console.log(monster);
            const attackRoll = Math.floor(roll([[1, 20]]) + user.stats.DEX);
            console.log(user.characterName, "attacks for with roll:", attackRoll, "vs monster's DEX", monster.stats.DEX);
            if (attackRoll > monster.stats.DEX) {
                let damageRoll = Math.floor(roll([[1, 6]]) + user.stats.STR - 10);
                // console.log(activeMonsters);
                // console.log(monster.name + " " + monster.id);
                damageRoll = (damageRoll > 0) ? damageRoll : 1;
                activeMonsters[monster.name + " " + monster.id].stats.HP -= damageRoll;
                console.log(activeMonsters[monster.name + " " + monster.id]);
                resolve(damageRoll);
            } else {
                resolve({ playerData: null, damage: null });
            }
        } catch (error) {
            console.log("ERROR FROM processPlayerAttack");
            console.log(error);
        }
    });
}

async function receiveAttack(io, socket, monsterObject, user, location) {
    try {
        let thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        console.log(thisMonster);
        switch (monsterObject.name) {
            case "Christmas Jello":
                activeMonsters[`${monsterObject.name} ${monsterObject.id}`] = thisMonster ? thisMonster : await christmasJelloFactory(monsterObject.id);
                thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
                // console.log('ACTIVE MONSTERS');
                // console.log(activeMonsters);
                if (thisMonster) {
                    processPlayerAttack(user, thisMonster).then(playerDamageToMonster => {
                        io.to(location.locationName).emit('battle', { attacker: user.characterName, defender: monsterObject.name, action: "attacks", damage: playerDamageToMonster });
                        setTimeout(async function () {
                            console.log("NOW IN THE .THEN AFTER PLAYER ATTACK");
                            console.log(activeMonsters[`${monsterObject.name} ${monsterObject.id}`]);
                            if (activeMonsters[`${monsterObject.name} ${monsterObject.id}`].stats.HP < 1) {
                                const statIncrease = getStatIncreaseFromMonsterKill(thisMonster, user);
                                io.to(location.locationName).emit('battleVictory', { victor: user.characterName, defeated: thisMonster.name });
                                console.log(`${thisMonster.name} has been defeated by ${user.characterName}!`);
                                updateAndDisseminateFightables({ io, singleLocationChunk: location, monsterObject, isAlive: false, isFighting: false });
                                incrementDexAndStrAndXP({ user: user.characterName, dex: statIncrease, str: statIncrease, xp: thisMonster.stats.XP }).then(playerData => {
                                    io.to(socket.id).emit('playerUpdate', playerData);
                                })
                                dropItemFromMonster(io, thisMonster, location.locationName);
                                return true;
                            } else {
                                let { playerData, damage } = await thisMonster.attack(user);
                                if (playerData) {
                                    io.to(socket.id).emit('playerUpdate', playerData);
                                }
                                io.to(location.locationName).emit('battle', { attacker: monsterObject.name, defender: user.characterName, action: monsterObject.attack, damage });
                                thisMonster.newEnemy(user.characterName);
                                console.log(thisMonster.enemies);
                                //send any updates to fightables
                                updateAndDisseminateFightables({ io, singleLocationChunk: location, monsterObject, isFighting: true });
                            }
                        }, 3000);
                    })
                } else {
                    console.log("ERROR FROM receiveAttack:");
                    console.log("the monster list did not include this monster");
                    return false;
                }
            default:
                break;
        }
    } catch (e) {
        console.log("ERROR FROM receiveAttack");
        console.log(e);
    }
}

module.exports = {
    receiveAttack,
    awakenMonsters,
    sleepMonsters,
    wakeMonstersOnMove,
    sleepMonstersOnMove
}