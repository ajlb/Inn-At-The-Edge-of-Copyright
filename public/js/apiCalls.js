

function getLocation(locationID) {
    return new Promise(function(resolve, reject){
        $.get("/api/locations/" + locationID, function(data){
            resolve(data);
        });
    });
}

function getAction(actionName) {
    return new Promise(function(resolve, reject){
        $.get("/api/actions/" + actionName, function(data){
            resolve(data);
        });
    });
}

function getActions() {
    return new Promise(function(resolve, reject){
        $.get("/api/actions/", function(data){
            resolve(data);
        })
    })
}

function getInventory(idString) {
    return new Promise(function(resolve, reject){
        $.get("/api/inventory/" + idString, function(data){
            resolve(data);
        });
    });
}

function getPlayerData(idNumber) {
    return new Promise(function(resolve, reject){
        $.get("/api/players/" + idNumber, function(data){
            resolve(data);
        }).catch(e => {
            reject(e);
        })
    });
}

function changeItemQuantity(item, location, amount){
    return new Promise(function(resolve, reject){
        let queryBody = {locator_id: location, itemId: parseInt(item), change:amount};
        $.ajax({
            url:'/api/inventory/quantity/',
            method: 'PUT',
            data: queryBody,
        }).then(function(data){
            resolve(data)
        });
    });
}

function fillPlayerInvSlot(item, player, slot){
    return new Promise(function(resolve, reject){
        let queryBody = {
            characterId: player,
            slotName: slot,
            itemId: item
        };
        $.ajax({
            url:'/api/playerEquipment/',
            method: 'PUT',
            data: queryBody,
        }).then(function(data){
            resolve(data)
        });
    });
}

function changeIsEquipped(item, location, amount){
    return new Promise(function(resolve, reject){
        let queryBody = {locator_id: location, itemId: parseInt(item), change:amount};
        $.ajax({
            url:'/api/inventory/isEquipped/',
            method: 'PUT',
            data: queryBody,
        }).then(function(data){
            resolve(data)
        });
    });
}

function scrubInventory(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: '/api/inventory/',
            method: 'DELETE'
        }).then(function(data){
            resolve(data);
        })
    })
}

function findItemData(itemName){
    return new Promise(function(resolve, reject){
        $.get("api/items/" + itemName, function(data){
            resolve(data);
        })
    })
}

function addItemToInventory(item, location, amount){
    let newInvObject = {
        locator_id: location,
        itemId: item,
        quantity: amount,
        currentlyEquipped: 0
    }
    return new Promise(function(resolve, reject){
        $.post('/api/inventory/', newInvObject, function(data){
            resolve(data);
        });
    });
}

function loginPlayer(characterName, password){
    $.post("/login", {characterName: characterName, password:password}).then(function(data){
        window.location.replace("/play");
    }).catch(e=>{
        console.log(e);
        logThis("I'm sorry, that character/password combination didn't match our records! For help with a forgotten password, contact us at innattheedgeofcopyright@gmail.com");
        setTimeout(function(){
            logThis("Do you want to try to log in again?");
        }, 600);
    });
}

function signupPlayer(characterName, password){
    $.post("/signup", {
        characterName: characterName,
        password:password
    }).then(function(data){
    }).catch(e => console.log(e));
}

function getPlayerFromLoginInfo(){
    return new Promise(function(resolve, reject){
        $.get("/api/user_data").then(function(data) {
            resolve(data);
        }).catch(e => reject(e));
    })
}

function locateEquippedItems(playerId){
    return new Promise(function(resolve, reject){
        $.get("/api/playerEquipment/" + playerId).then(function(data){
            resolve(data);
        }).catch(e => reject(e));
    })
}

function incrementStat(stat, amount, characterName){
    return new Promise(function(resolve, reject){
        let queryBody = {stat: stat, amount:amount, characterName:characterName};
        $.ajax({
            url: "/api/playerStats",
            method: "PUT",
            data:queryBody
        }).catch(e => reject(e));
    });
}