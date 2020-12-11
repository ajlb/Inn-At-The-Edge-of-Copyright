const { christmasJelloFactory } = require("./monsters");
const db = require("../models");
const mongoose = require("mongoose");
const { roll } = require("./userInput/characterLeveling");

function random9DigitNumber() {
    let numberString = "";
    for (i = 0; i < 9; i++) {
        numberString += Math.floor(Math.random() * 10);
    }
    return parseInt(numberString);
}


//to do:
//give players XP and DEX/STR after a fight
//random chance of item drop?
//give players edible jello cup?
//set timer to have jello fight back
//set disengage reminder at half health or below 5


let activeMonsters = {};

async function awakenMonsters(monsterObject){
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

async function sleepMonsters(monsterObject){
    console.log("inside sleepMonsters");
    try {
        let thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        if (thisMonster){
            delete activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
        }
        console.log("ACTIVE MONSTERS AFTER SLEEP");
        console.log(activeMonsters);
    } catch (e) {
        console.log("ERROR FROM sleepMonsters");
        console.log(e);
    }
}

async function processPlayerAttack(user, monster){
        return new Promise(async function(resolve, reject){
            try {
                console.log("MONSTER FROM PROCESS PLAYER");
                console.log(monster);
                const attackRoll = roll([[1, 20]]) + user.stats.DEX;
                console.log(user.characterName, "attacks for with roll:", attackRoll, "vs monster's DEX", monster.stats.DEX);
                if (attackRoll > monster.stats.DEX){
                    let damageRoll = roll([[1,6]]) + user.stats.STR - 10;
                    // console.log(activeMonsters);
                    // console.log(monster.name + " " + monster.id);
                    damageRoll = (damageRoll > 0) ? damageRoll : 1;
                    activeMonsters[monster.name + " " + monster.id].stats.HP -= damageRoll;
                    console.log(activeMonsters[monster.name + " " + monster.id]);
                    resolve(damageRoll);
                } else {
                    resolve({playerData:null, damage:null});
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
                        io.to(location.locationName).emit('battle', { attacker: user.characterName, defender: monsterObject.name, action: "attacks", damage:playerDamageToMonster });
                        setTimeout(async function (){
                            console.log("NOW IN THE .THEN AFTER PLAYER ATTACK");
                            console.log(activeMonsters[`${monsterObject.name} ${monsterObject.id}`]);
                            if (activeMonsters[`${monsterObject.name} ${monsterObject.id}`].stats.HP < 1){
                                io.to(location.locationName).emit('battleVictory', {victor:user.characterName, defeated:thisMonster.name});
                                console.log(`${thisMonster.name} has been defeated by ${user.characterName}!`);
                                db.Location.findOneAndUpdate({ locationName: location.locationName }, { $set: { "fightables.$[mob].isFighting": false, "fightables.$[mob].isAlive": false } }, { arrayFilters: [{ "mob.id": monsterObject.id }], new: true }).then(returnData => {
                                    //send location update to anyone with that location in their locationChunk
                                    if (returnData){
                                        io.to(location.locationName).emit('updateFightables', {fightables:returnData.fightables, targetLocation:returnData.locationName});
                                        console.log(returnData);
                                        for (const param in returnData.exits){
                                            io.to(returnData[param]).emit('updateFightables', {fightables: returnData.fightables, targetLocation:returnData.locationName});
                                        }
                                    }
                                }).catch(e=>console.log(e));
                                return true;
                            } else {
                                let { playerData, damage } = await thisMonster.attack(user);
                                if (playerData){
                                    io.to(socket.id).emit('playerUpdate', playerData);
                                }
                                io.to(location.locationName).emit('battle', { attacker: monsterObject.name, defender: user.characterName, action: monsterObject.attack, damage });
                                thisMonster.newEnemy(user.characterName);
                                console.log(thisMonster.enemies);
                                //send any updates to fightables
                                db.Location.findOneAndUpdate({ locationName: location.locationName }, { $set: { "fightables.$[mob].isFighting": true } }, { arrayFilters: [{ "mob.id": monsterObject.id }], new: true }).then(returnData => {
                                    //send location update to anyone with that location in their locationChunk
                                    if (returnData){
                                        io.to(location.locationName).emit('updateFightables', {fightables:returnData.fightables, targetLocation:returnData.locationName});
                                        console.log(returnData);
                                        for (const param in returnData.exits){
                                            io.to(returnData[param]).emit('updateFightables', {fightables: returnData.fightables, targetLocation:returnData.locationName});
                                        }
                                    }
                                }).catch(e=>console.log(e));
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
    sleepMonsters
}