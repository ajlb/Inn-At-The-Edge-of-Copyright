const axios = require("axios");

function getPlayerDayNight(playerName){
    return new Promise(function(resolve, reject){
        axios.get("http://localhost:3001/backAPI/playerTime", playerName).then(data => {
                let currentDay = data.data.day;
                currentDay ? console.log("... day") : console.log("... night");
                resolve(currentDay);
            })
    });
}

module.exports = function dayNight(socket) {
    let currentDay;
    let finalDay;
    let userIPs = {};

    socket.emit('joinRequest', 'backEngine');
    socket.off('dataRequest').on('dataRequest', objectOfUsers=>{
        console.log(objectOfUsers);
        for (const user in objectOfUsers){
            let socketID = objectOfUsers[user].socketID;
            console.log(socketID);
            userIPs[socketID].nickname = user;
        }
        console.log(userIPs);
    });

    socket.off('location').on('location', ({locationData, id}) => {
        console.log("location:", id);
        console.log(locationData);
        userIPs[id] = {city: locationData.city, continent: locationData.continent_code}
        console.log(userIPs);
    })


    const dayNightInterval = setInterval(() => {
        socket.emit('dataRequest');
        let now = new Date()

        // for (const user in userIPs){
        //     currentDay = getPlayerDayNight(userIPs[user].nickname)
        // }

        // axios.get("https://extreme-ip-lookup.com/json/").then(data => {
        //     const city = data.data.city.replace(" ", "_");
        //     const continent = data.data.continent.replace(" ", "_");

        //     //weather call to determine user sunrise/sunset time
        //     axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + data.data.lat + "&lon=" + data.data.lon + "&appid=a2e2e87c947af1ae1888811705b0441c").then(weatherData => {
        //         let sunrise = weatherData.data.sys.sunrise * 1000;
        //         let sunset = weatherData.data.sys.sunset * 1000;
        //         sunrise = new Date(sunrise);
        //         sunset = new Date(sunset);
                
        //         if ((now > sunset)) {
        //             finalDay = false;
                    
        //         } else if (now > sunrise) {
        //             finalDay = true;
        //         }
        //         socket.emit('dayNight', finalDay);
        //         if (!(currentDay === finalDay)) {
        //             axios.put("http://localhost:3001/backAPI/playerTime", { day: finalDay }).then(data => {
        //                 finalDay ? console.log("It has become day") : console.log("It has become night");;
        //                 //SEND OUT SOCKET.IO MESSAGE TO TRIGGER SESSION DATA CHANGE
        //                 socket.emit('dayNight', finalDay);
        //             })
        //         }
                

    //         }).catch(e => {
    //             console.log("Error from axios get weather call");
    //             console.log(e);
    //         })
    //     })



    }, 10000)
}

// 600000