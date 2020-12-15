const axios = require("axios");
const db = require("../models");

module.exports = function dayNight(io, socket, objectOfUsers) {
    try {
        let currentDay;
        let finalDay;

        const dayNightInterval = setInterval(() => {
            let now = new Date()
            console.log("checking day/night for all users");

            for (const user in objectOfUsers) {
                const lowerName = objectOfUsers[user].lowerName;
                if (typeof lowerName === 'string') {
                    // console.log("We're gonna get data!!!!!");
                    // console.log(lowerName);
                    db.Player.findOne({ characterNameLowerCase: lowerName }).then(data => {
                        currentDay = data.day;
                        // currentDay ? console.log("... day") : console.log("... night");

                        const lat = objectOfUsers[user].latitude;
                        const lon = objectOfUsers[user].longitude;


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
                                db.Player.updateOne({ characterNameLowerCase: lowerName }, { $set: { day: finalDay } }).then(data => {
                                    finalDay ? console.log("It has become day") : console.log("It has become night");
                                    //SEND OUT SOCKET.IO MESSAGE TO TRIGGER SESSION DATA CHANGE
                                    console.log(lowerName);
                                    io.to(lowerName).emit('dayNight', { day: finalDay, user: objectOfUsers[user].nickname });
                                })
                            }


                        }).catch(e => {
                            console.log("Error from axios get weather call");
                            console.log(e);
                        })
                    }).catch(e => { console.log(e) })
                }
            }
        }, 600000)
    } catch (e) {
        console.log("ERROR FROM dayNight:");
        console.log(e);
    }
}