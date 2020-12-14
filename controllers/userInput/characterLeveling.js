let WIS, DEX, STR, HP, CHA;

// Dice roller functionality
function getRandomInt (max) {
    return Math.floor(Math.random() * max)
}

function roll (dice) {
    let sum = 0

    dice.forEach(die => {
        for (let i = 0; i < die[0]; i++) {
            sum += getRandomInt(die[1]) + 1
        }
    })
    fairnessModulator(sum, dice[0], dice[1]*dice[0])
    return sum
}

function nextLevel(level) {
    return Math.round((4 * (level **3) /5 ))
}

function generateBaseStats() {
    WIS = roll([[4,6]]);//roll 4d6  
    DEX = roll([[4,6]]);//roll 4d6  
    STR = roll([[4,6]]);//roll 4d6  
    CHA = roll([[4,6]]);//roll 4d6
    HP = roll([[6,6]]);//roll 4d6

    return {WIS, DEX, STR, CHA, HP}
}

function fairnessModulator(inputStat, min, max) {
    if (inputStat === min){
        //increase stat
        return min+6
    }
    if (inputStat === max) {
        //decrease stat
        return max-6
    }
}

module.exports = {
    roll,
    generateBaseStats,
    nextLevel
}
