let wis, dex, str, hp;

// Dice roller functionality
function getRandomInt (max) {
    return Math.floor(Math.random() * max)
}

module.exports = {
    nextLevel: (level) => {
        return Math.round((4 * (level **3) /5 ))
    },

    roll: (dice) => {
        let sum = 0

        dice.forEach(die => {
            for (let i = 0; i < die[0]; i++) {
                sum += getRandomInt(die[1]) + 1
            }
        })
        return sum
    },

    generateBaseStats: () => {
        wis = roll([[4,6]]);//roll 4d6  
        dex = roll([[4,6]]);//roll 4d6  
        str = roll([[4,6]]);//roll 4d6  
        hp = roll([[4,6]]);//roll 4d6

        return wis, dex, str, hp
    }
}
