function getLocation(locationID) {
    return new Promise(function(resolve, reject){
        $.get("/api/locations/" + locationID, function(data){
            console.log(data);
            resolve(data);
        })
    })
}