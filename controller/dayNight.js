const axios = require("axios");

module.exports = function dayNight() {
    let currentDay;
    let finalDay;


    const dayNightInterval = setInterval(() => {
        let now = new Date()
        axios.get("http://localhost:3001/API/playerTime").then(data => {
            currentDay = data.data.day;
            currentDay ? console.log("... day") : console.log("... night");
        })


        axios.get("https://extreme-ip-lookup.com/json/").then(data => {
            const city = data.data.city.replace(" ", "_");
            const continent = data.data.continent.replace(" ", "_");

            //weather call to determine user sunrise/sunset time
            axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + data.data.lat + "&lon=" + data.data.lon + "&appid=a2e2e87c947af1ae1888811705b0441c").then(weatherData => {
                let sunrise = weatherData.data.sys.sunrise * 1000;
                let sunset = weatherData.data.sys.sunset * 1000;
                sunrise = new Date(sunrise);
                sunset = new Date(sunset);

                if ((now < sunrise) && (now > sunset)) {
                    finalDay = false;

                } else {
                    finalDay = true;
                }
                if (!(currentDay === finalDay)) {
                    axios.put("http://localhost:3001/API/playerTime", { day: finalDay }).then(data => {
                        finalDay ? console.log("It has become day") : console.log("It has become night");;
                        //SEND OUT SOCKET.IO MESSAGE TO TRIGGER SESSION DATA CHANGE
                    })
                }
                

            }).catch(e => {
                console.log("Error from axios get weather call");
                console.log(e);
            })
        })



    }, 600000)
}