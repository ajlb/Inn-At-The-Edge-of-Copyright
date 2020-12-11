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

async function receiveAttack(io, socket, target, user, location) {
    let thisMonster = activeMonsters[`${target.name} ${target.id}`];
    console.log(thisMonster);
    switch (target.name) {
        case "Christmas Jello":
            activeMonsters[`${target.name} ${target.id}`] = thisMonster ? thisMonster : await christmasJelloFactory(target.id);
            thisMonster = activeMonsters[`${target.name} ${target.id}`];
            console.log('ACTIVE MONSTERS');
            console.log(activeMonsters);
            if (thisMonster) {
                thisMonster.attack(user);
                thisMonster.newEnemy(user.characterName);
                console.log(thisMonster.enemies);
            } else {
                console.log("ERROR FROM receiveAttack:");
                console.log("the monster list did not include this monster");
                return false;
            }
            db.Location.findOneAndUpdate({locationName:location.locationName}, {$set: {"fightables.$[mob].isFighting": true}}, {arrayFilters:[{"mob.id":target.id}], new:true}).then(returnData=>{
                console.log(returnData);
            });
            break;

        default:
            break;
    }
}

module.exports = {
    receiveAttack
}