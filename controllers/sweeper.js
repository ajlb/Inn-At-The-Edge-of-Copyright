const db = require("../models");
const locationSeed = require("../scripts/seed/4-locations/locations.json");



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
                        if (((new Date() - new Date(time)) * (1000 * 60)) > 2) {
                            return time
                        }
                    })
                    if (timesToRemove.length < quantityToTrash) {
                        quantityToTrash = timesToRemove.length;
                    }
                    // console.log("number to remove", quantityToTrash, realItem.item);
                    if (quantityToTrash > 0) {
                        diffObject[realItem.item] = quantityToTrash;
                    }
                }
            } else {
                // console.log("UNWANTED ITEM:", realItem.quantity);
                let timesToRemove = realItem.dropTime.filter(time => {
                    // console.log(((new Date() - new Date(time)) * (1000 * 60)) > 2);
                    if (((new Date() - new Date(time)) * (1000 * 60)) > 2) {
                        return time
                    }
                })
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
            console.log(diffObject);
            resolve(diffObject);
        }
    });
}

async function runSweep() {
    try {
        db.Location.find({}).then(allLocations => {

            for (const index in allLocations) {
                checkLocale(index, allLocations).then(changeDetected => {
                    if (!(changeDetected === false)) {
                        console.log("Found a change!");
                        console.log(changeDetected);
                    }
                })
            }




        }).catch(e => console.log(e));
    } catch (e) {
        console.log("ERROR FROM runSweep");
        console.log(e);
    }

}

module.exports = runSweep