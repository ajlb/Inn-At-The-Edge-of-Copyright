

function getLocation(locationID) {
    return new Promise(function(resolve, reject){
        $.get("/api/locations/" + locationID, function(data){
            console.log(data);
            resolve(data);
        });
    });
}

function getAction(actionName) {
    return new Promise(function(resolve, reject){
        $.get("/api/actions/" + actionName, function(data){
            console.log(data);
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
            console.log(data);
            resolve(data);
        });
    });
}

function getPlayerData(idNumber) {
    return new Promise(function(resolve, reject){
        $.get("/api/players/" + idNumber, function(data){
            console.log(data);
            resolve(data);
        });
    });
}

function changeItemQuantity(item, location, amount){
    return new Promise(function(resolve, reject){
        let queryBody = {locator_id: location, itemId: parseInt(item), change:amount};
        console.log("Changing quantities");
        console.log(queryBody);
        $.ajax({
            url:'/api/inventory/',
            method: 'PUT',
            data: queryBody,
        }).then(function(data){
            console.log("changed");
            console.log(data);
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
            console.log("scrubbing");
            console.log(data);
            resolve(data);
        })
    })
}

function addItemToInventory(item, location, amount){
    let newInvObject = {
        locator_id: location,
        itemId: item,
        quantity: amount,
    }
    return new Promise(function(resolve, reject){
        $.post('/api/inventory/', newInvObject, function(data){
            console.log('adding item');
            resolve(data);
        });
    });
}