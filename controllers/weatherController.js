const axios = require("axios");
const db = require("../models");

module.exports = function weatherTimer(io, socket) {
    try {


        const weatherInterval = setInterval(() => {
            

        }, 60000)
    } catch (e) {
        console.log("ERROR FROM weather controller");
        console.log(e);
    }
}