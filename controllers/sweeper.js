const db = require("../models");
const locationSeed = require("../scripts/seed/4-locations/locations.json");
const { pushItemToInventoryReturnData, incrementItemUpdateOne, findPlayerData, decrementItemUpdateOne, scrubInventoryReturnData } = require("./userInput/getDrop");
const { findLocationData } = require("./userInput/move");



function checkLocale(index, allLocations) {
    return new Promise(function (resolve, reject) {
        const realTimeInventory = allLocations[index].inventory;
        const seedInventory = locationSeed[index].inventory;
        const diffObject = {};
        // console.log(allLocations[index].locationName);
        for (const realItem of realTimeInventory) {

            matchedInSeedArray = seedInventory.filter(item => {
                if (item.item['$oid'] === realItem.item.toString()) {
                    return item;
                }
            });

            if (matchedInSeedArray.length === 1) {
                let quantityToAdd = 0;
                let quantityToTrash = 0;
                // console.log("SEED:", matchedInSeedArray[0].quantity);
                // console.log("REAL:", realItem.quantity);
                if (matchedInSeedArray[0].quantity > realItem.quantity) {
                    // console.log('GOT A MINUS');
                    quantityToAdd += matchedInSeedArray[0].quantity - realItem.quantity;
                    // console.log("quantity to add:", quantityToAdd);
                    if (quantityToAdd > 0) {
                        diffObject[realItem.item] = quantityToAdd;
                    }
                } else if (realItem.quantity > matchedInSeedArray[0].quantity) {
                    quantityToTrash = realItem.quantity - matchedInSeedArray[0].quantity;
                    let timesToRemove = realItem.dropTime.filter(time => {
                        // console.log(((new Date() - new Date(time)) * (1000 * 60)) > 2);
                        if (((new Date() - new Date(time)) * (1000 * 60)) > 30) {
                            return time
                        }
                    })
                    if (timesToRemove.length < quantityToTrash) {
                        quantityToTrash = timesToRemove.length;
                    }
                    // console.log("number to remove", quantityToTrash, realItem.item);
                    if (quantityToTrash > 0) {
                        diffObject[realItem.item] = -quantityToTrash;
                    }
                }
            } else {
                // console.log("UNWANTED ITEM:", realItem.quantity);
                let timesToRemove = realItem.dropTime.filter(time => {
                    // console.log(((new Date() - new Date(time)) * (1000 * 60)) > 2);
                    if (((new Date() - new Date(time)) * (1000 * 60)) > 30) {
                        return time
                    }
                })
                // console.log("HERE'S SOMETHING THAT DOESN'T GO.");
                // console.log(timesToRemove.length);
                diffObject[realItem.item] = -timesToRemove.length;
                // console.log("quantity to remove of unmatched item:", timesToRemove.length, realItem.item);
            }

        }
        for (const seedItem of seedInventory) {
            let matchingItems = realTimeInventory.filter(item => {
                return item.item.toString() === seedItem.item["$oid"].toString();
            })
            // console.log(matchingItems.length);
            if (matchingItems.length === 0) {
                quantityToAdd = seedItem.quantity;
                diffObject[seedItem.item["$oid"].toString()] = quantityToAdd;
                // console.log("quantity of unmatched items to add:", quantityToAdd, seedItem.item["$oid"].toString());
            }
        }
        if (Object.keys(diffObject).length === 0) {
            resolve(false);
        } else {
            diffObject.locationName = allLocations[index].locationName
            // console.log(diffObject);
            resolve(diffObject);
        }
    });
}

async function runSweep(io, socket) {
    console.log("sweeping items");
    try {
        let anyItemsSwept = [];
        db.Location.find({}).then(async allLocations => {

            for (const index in allLocations) {
                await checkLocale(index, allLocations).then(changeDetected => {
                    if (!(changeDetected === false)) {
                        console.log("Found a change!");
                        anyItemsSwept.push(changeDetected.locationName);
                        console.log(changeDetected);
                        for (const itemId in changeDetected) {
                            if (changeDetected[itemId] > 0) {
                                incrementItemUpdateOne(itemId, changeDetected.locationName, "location").then(updateData => {
                                    if (!updateData) {
                                        pushItemToInventoryReturnData(itemId, changeDetected.locationName, "location").then(locationData => {
                                            io.to(locationData.locationName).emit('invUpL', locationData.inventory);
                                            for (const param in locationData.exits){
                                                io.to(locationData.exits[param]).emit('locationChunkUpdate', {newData:locationData, targetName:locationData.locationName})
                                            }
                                        })
                                    } else {
                                        findLocationData(changeDetected.locationName).then(locationData => {
                                            io.to(locationData.locationName).emit('invUpL', locationData.inventory);
                                            for (const param in locationData.exits){
                                                io.to(locationData.exits[param]).emit('locationChunkUpdate', {newData:locationData, targetName:locationData.locationName})
                                            }
                                        })
                                    }
                                })
                            } else if (changeDetected[itemId] < 0) {
                                console.log('WE SHOULD BE DECREMENTING THIS');
                                decrementItemUpdateOne(itemId, changeDetected.locationName, "location").then(() => {
                                    scrubInventoryReturnData(changeDetected.locationName, "location").then(locationData => {
                                        io.to(locationData.locationName).emit('invUpL', locationData.inventory);
                                        for (const param in locationData.exits){
                                            io.to(locationData.exits[param]).emit('locationChunkUpdate', {newData:locationData, targetName:locationData.locationName})
                                        }
                                    })
                                })
                            }
                        }
                    }
                })
            }
            
            if (anyItemsSwept.length > 0){
                for (locationName of anyItemsSwept){
                    io.to(locationName).emit('genericMessage', `A shiny stainless steel roomba zips through, paushing briefly to brandish a knife at you, before sweeping up some items and racing out.`);
                }
            }


        }).catch(e => console.log(e));
    } catch (e) {
        console.log("ERROR FROM runSweep");
        console.log(e);
    }

}



module.exports = runSweep