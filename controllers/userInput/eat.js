const db = require("../../models");
// const mongoose = require("mongoose");


function getItemFromName(itemName) {
    return new Promise((resolve, reject) => {
        db.Item.findOne({ itemName }).then(data => {
            resolve(data);
        }).catch(e => {
            console.log("DB CATCH FROM getItemIdFromName:");
            console.log(e);
            reject(e);
        })
    })
}


function eatItem(socket, io, target, itemId, player){
    try {
        getItemFromName(target).then(itemData =>{
            console.log(itemData);
            if (itemData.edible){
                
            } else {
                io.to(player.toLowerCase()).emit('failure', `The ${target} doesn't seem like something that's meant to be eaten.`)
            }
        })
    
    } catch (e) {
        console.log("ERROR FROM eatItem:");
        console.log(e);
    }
}

module.exports = {
    eatItem
}