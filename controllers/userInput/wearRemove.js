const db = require("../../models");
const mongoose = require("mongoose");


function findItem(itemName){
    return new Promise(function(resolve, reject){
        db.Item.findOne({ itemName: itemName }).then(data=>{
            resolve(data);
        });
    });
}


module.exports = {
    findItem
}