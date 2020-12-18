const axios = require("axios");
const db = require("../models");

module.exports = function weatherTimer(io, socket) {
    try {


        const weatherInterval = setInterval(() => {
            console.log('tick');
            db.Location.find({})
                .then(locationArray => {
                    let regionArray = [];
                    locationArray.forEach(locationData => {
                        if (!regionArray.includes(locationData.region)) {
                            regionArray.push(locationData.region);
                        }
                    })
                    console.log(regionArray);
                    regionArray.forEach(regionName => {
                        db.Weather.find({})
                            .then(weatherData => {
                                const shuffleWeather = weatherData.map((weather) => ({ sort: Math.random(), value: weather.weatherCondition }))
                                    .sort((weather, element) => weather.sort - element.sort)
                                    .map((weather) => weather.value);
                                let weather = shuffleWeather.pop();
                                db.Location.updateMany({ region: regionName }, { $set: { weather } })
                                    .then(updateData => {
                                        console.log(updateData);
                                    })

                            })
                    })
                })

        }, 10000)
    } catch (e) {
        console.log("ERROR FROM weather controller");
        console.log(e);
    }
}