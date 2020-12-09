const db = require("../../models");
const mongoose = require("mongoose");
let sleepInterval;

async function setSleepHealing(io, socket, user){
    db.Player.findOne({characterName:user})
    .select("stats")
    .then(({stats})=>{
        console.log(stats);
        if (stats.HP < stats.maxHP){
            sleepInterval = setInterval(() => {
                db.Player.findOneAndUpdate({characterName: user}, {$inc: {"stats.HP": 1}}, {new:true})
                .populate('inventory.item')
                .then(data =>{
                    if (data === null){
                        clearInterval(sleepInterval);
                        console.log("sleep interval cleared due to failed DB call");
                    } else {
                        io.to(socket.id).emit("playerUpdate", data);
                        if(data.stats.HP === data.stats.maxHP){
                            clearInterval(sleepInterval);
                        }
                    }
                }).catch(e=>{
                    console.log("catch from sleepInterval DB call");
                    console.log(e);
                })
            }, 5000);
        }
    })
    .catch(e=>{
        console.log("error in db FindOne in setSleepHealing");
        console.log(e);
    });
}


function wakeUp(io, socket, user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: true } })
            .then(playerData => {
                try {
                    clearInterval(sleepInterval);
                } catch (e) {
                    console.log("could not clear sleepInterval");
                }
                resolve(!playerData.isAwake);
            })
            .catch(e => {
                reject(e)
                console.log('ERROR IN DB CALL');
                console.log(e);
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");

            });
    });
}

function goToSleep(io, socket, user) {
    return new Promise(function (resolve, reject) {
        db.Player.findOneAndUpdate({ characterName: user }, { $set: { isAwake: false } })
            .then(playerData => {
                if (playerData.isAwake){
                    setSleepHealing(io, socket, user);
                }
                resolve(playerData.isAwake)
            })
            .catch(e => {
                console.log('ERROR IN DB CALL');
                console.log(e);
                io.to(socket.id).emit('failure', "I'm sorry, something went wrong.");

            });
    });
}


module.exports = {
    wakeUp,
    goToSleep
}