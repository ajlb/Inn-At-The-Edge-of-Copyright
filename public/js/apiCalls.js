

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
            url:'/api/inventory/',
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

function findItemId(itemName){
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
    }).catch(e=>console.log(e));
}

function signupPlayer(characterName, password){
    $.post("/signup", {
        characterName: characterName,
        password:password
    }).then(function(data){
        console.log(data);
    }).catch(e => console.log(e));
}

function getPlayerFromLoginInfo(){
    return new Promise(function(resolve, reject){
        $.get("/api/user_data").then(function(data) {
            console.log(data);
            resolve(data);
        }).catch(e => reject(e));
    })
}