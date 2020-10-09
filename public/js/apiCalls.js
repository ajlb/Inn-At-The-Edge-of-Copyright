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
        console.log("In apiCalls: " + idString);
        $.get("/api/inventory/" + idString, function(data){
            console.log(data);
            resolve(data);
        });
    });
}
