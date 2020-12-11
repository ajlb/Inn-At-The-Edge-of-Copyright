const { christmasJelloFactory } = require("./monsters");
const db = require("../models");
const mongoose = require("mongoose");

function random9DigitNumber() {
    let numberString = "";
    for (i = 0; i < 9; i++) {
        numberString += Math.floor(Math.random() * 10);
    }
    return parseInt(numberString);
}

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

async function receiveAttack(io, socket, monsterObject, user, location) {
    let thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
    console.log(thisMonster);
    switch (monsterObject.name) {
        case "Christmas Jello":
            activeMonsters[`${monsterObject.name} ${monsterObject.id}`] = thisMonster ? thisMonster : await christmasJelloFactory(monsterObject.id);
            thisMonster = activeMonsters[`${monsterObject.name} ${monsterObject.id}`];
            console.log('ACTIVE MONSTERS');
            console.log(activeMonsters);
            if (thisMonster) {
                let { playerData, damage } = await thisMonster.attack(user);
                if (playerData){
                    io.to(socket.id).emit('playerUpdate', playerData);
                }
                io.to(location.locationName).emit('battle', { attacker: monsterObject.name, defender: user.characterName, action: monsterObject.attack, damage });
                thisMonster.newEnemy(user.characterName);
                console.log(thisMonster.enemies);
            } else {
                console.log("ERROR FROM receiveAttack:");
                console.log("the monster list did not include this monster");
                return false;
            }
            db.Location.findOneAndUpdate({ locationName: location.locationName }, { $set: { "fightables.$[mob].isFighting": true } }, { arrayFilters: [{ "mob.id": monsterObject.id }], new: true }).then(returnData => {
                console.log(returnData);
            });
            break;

        default:
            break;
    }
}

module.exports = {
    receiveAttack,
    awakenMonsters,
    sleepMonsters
}