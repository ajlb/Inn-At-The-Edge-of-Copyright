const { roll } = require("./userInput/characterLeveling");


function christmasJelloFactory(id) {
    return new Promise(function(resolve, reject){
        const jello = {};
        jello.id = id;
        jello.stats = {
            "WIS": 5,
            "DEX": 2,
            "STR": 1,
            "HP": 6,
            "maxWIS": 50,
            "maxDEX": 50,
            "maxSTR": 50,
            "maxHP": 6,
            "XP": 3,
            "level": 1,
            "maxCHA": 80.0,
            "CHA": 10.0
        };
        jello.description = "This christmas jello is tri-color, with red on top, white in the middle, and green on bottom. You have heard the red is strawberry and the green is lime, but no one is willing to talk about the white part...";
        jello.isLiving = true;
        jello.race = "Holiday Dessert";
        jello.enemies = new Set();
    
        jello.attack = (target) => {
            const attackRoll = roll([[1, 20]]) + jello.stats.DEX;
            console.log("jello attacks for with roll:", attackRoll, "vs user's DEX", target.stats.DEX);
        }
    
        jello.newEnemy = (target) => {
            jello.enemies.add(target);
        }
        resolve(jello);
        
    });
}

module.exports = {
    christmasJelloFactory
}