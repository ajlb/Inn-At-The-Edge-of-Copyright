
let intervalId;

function updateHourly()
intervalId = setInterval(perHour, 1000 * 60 * 60);




export {
    updateHourly,
}
// export default shuffleWeather;


// let shuffleWeather = weatherData.map((weather) => ({ sort: Math.random(), value: weather }))
//weatherData.map((weather) => ({ sort: Math.random(), value: weather }))
//     .sort((weather, element) => weather.sort - element.sort)
//     .map((weather) => weather.value);