const axios = require("axios");

module.exports = function dayNight(socket) {
    let currentDay;
    let finalDay;
    let userIPs = {};

    socket.emit('joinRequest', 'backEngine');
    socket.off('dataRequest').on('dataRequest', objectOfUsers => {
        console.log(objectOfUsers);
        for (const user in objectOfUsers) {
            let socketID = objectOfUsers[user].socketID;
            console.log(socketID);
            userIPs[socketID].nickname = objectOfUsers[user].nickname;
        }
        console.log(userIPs);
    });

    socket.off('location').on('location', ({ locationData, id }) => {
        console.log("location:", id);
        console.log(locationData);
        userIPs[id] = { latitude: locationData.latitude, longitude: locationData.longitude }
        console.log(userIPs);
    })


    const dayNightInterval = setInterval(() => {
        socket.emit('dataRequest');
        let now = new Date()

        for (const user in userIPs) {
            const userName = userIPs[user].nickname;
            if (typeof userName === 'string') {
                console.log("We're gonna get data!!!!!");
                console.log(userName);
                axios.get("http://localhost:3001/backAPI/playerTime/" + userName).then(data => {
                    let currentDay = data.data.day;
                    currentDay ? console.log("... day") : console.log("... night");

                    const lat = userIPs[user].latitude;
                    const lon = userIPs[user].longitude;


                    // weather call to determine user sunrise/sunset time
                    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=a2e2e87c947af1ae1888811705b0441c").then(weatherData => {
                        let sunrise = weatherData.data.sys.sunrise * 1000;
                        let sunset = weatherData.data.sys.sunset * 1000;
                        sunrise = new Date(sunrise);
                        sunset = new Date(sunset);

                        if ((now > sunset)) {
                            finalDay = false;

                        } else if (now > sunrise) {
                            finalDay = true;
                        }
                        if (!(currentDay === finalDay)) {
                            axios.put("http://localhost:3001/backAPI/playerTime", { day: finalDay, playerName:userName }).then(data => {
                                finalDay ? console.log("It has become day") : console.log("It has become night");
                                //SEND OUT SOCKET.IO MESSAGE TO TRIGGER SESSION DATA CHANGE
                                console.log(userName);
                                socket.emit('dayNight', {day:finalDay, user:userName});
                            })
                        }


                    }).catch(e => {
                        console.log("Error from axios get weather call");
                        console.log(e);
                    })
                }).catch(e => { console.log(e) })

            }
        }



    }, 60000)
}