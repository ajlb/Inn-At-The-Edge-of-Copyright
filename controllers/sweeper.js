const db = require("../models");
const locationSeed = require("../scripts/seed/4-locations/locations.json");



function checkLocale(index, allLocations) {
    return new Promise(function (resolve, reject) {
        const realTimeInventory = allLocations[index].inventory;
        const seedInventory = locationSeed[index].inventory;
        const diffObject = {};
        for (const realItem of realTimeInventory) {

            matchedInSeedArray = seedInventory.filter(item => {
                if (item.item['$oid'] === realItem.item.toString()){
                    return item;
                }
            });

            if (matchedInSeedArray.length === 1){
                let quantityToAdd = 0;
                let quantityToTrash = 0;
                if (matchedInSeedArray[0].quantity > realItem.quantity){
                    quantityToAdd += matchedInSeedArray[0].quantity - realItem.quantity;
                } else if (realItem.quantity > matchedInSeedArray[0].quantity){
                    let timesToRemove = realItem.dropTime.filter(time => {
                        console.log(((new Date() - new Date(time)) * (1000 * 60)) > 2);
                        if (((new Date() - new Date(time)) * (1000 * 60)) > 2){
                            return time
                        }
                    })
                }
                // if (quantityToTrash > 0) {
                //     diffObject[realTimeInventory[itemIndex].item] = quantityToTrash;
                // }
                // if (quantityToAdd > 0) {
                //     diffObject[realTimeInventory[itemIndex].item] = quantityToAdd;
                // }
            } else {
                console.log("NO MATCH");
            }

            // for (const seedItemIndex in seedInventory) {
            //     //item is in room seed
            //     // console.log(typeof seedInventory[seedItemIndex].item['$oid']);
            //     // console.log(typeof realItem.item.toString());
            //     // console.log(realItem.item.toString() == seedInventory[seedItemIndex].item['$oid']);

            //     //item is not in room seed
            //     console.log(realItem);
            //     for (time of realItem.dropTime) {
            //         console.log(((new Date() - new Date(time)) / (1000 * 60)) > 1);
            //         if (((new Date() - new Date(time)) / (1000 * 60)) > 1) {
            //             console.log("old item!");
            //         }
            //     }

            // }
            resolve(true)
        }

        // if (Object.keys(diffObject).length === 0) {
        //     resolve(false);
        // } else {
        //     resolve(diffObject);
        // }
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