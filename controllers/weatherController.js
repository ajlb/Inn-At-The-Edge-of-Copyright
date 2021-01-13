const axios = require("axios");
const db = require("../models");
const { findLocationData } = require("./userInput/move");

module.exports = function weatherTimer(io, socket, user) {
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
                                //  let weatherArray = [];
                                let shuffleWeather = weatherData.map((weather) => ({ sort: Math.random(), value: weather.weatherCondition }))
                                    .sort((weather, element) => weather.sort - element.sort)
                                    .map((weather) => weather.value);
                                // console.log(shuffleWeather);
                                let weather = shuffleWeather.shift();
                                db.Location.updateMany({ region: regionName }, { $set: { weather: weather } })
                                    .then(updateData => {
                                        console.log(updateData);
                                        db.Location.findOne({ region: regionName })
                                            .then(singleRegion => {
                                                regionWeather = singleRegion.weather;
                                                console.log(regionWeather);
                                                io.emit("weatherData", { regionWeather, regionName })
                                            })
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