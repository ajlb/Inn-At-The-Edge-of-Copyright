import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders"
import { pluralizeAppropriateWords } from "./inventory";
import e from "cors";

//this is the juggling interval
let juggleTime;

const numberWords = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five twenty-six twenty-seven twenty-eight twenty-nine thirty thirty-one thirty-two thirty-three thirty-four thirty-five thirty-six thirty-seven thirty-eight thirty-nine fourty fourty-one fourty-two fourty-three fourty-four fourty-five fourty-six fourty-seven fourty-eight fourty-nine fifty fifty-one fifty-two fifty-three fifty-four fifty-five fifty-six fifty-seven fifty-eight fifty-nine sixty sixty-one sixty-two sixty-three sixty-four sixty-five sixty-six sixty-seven sixty-eight sixty-nine seventy seventy-one seventy-two seventy-three seventy-four seventy-five seventy-six seventy-seven seventy-eight seventy-nine eighty eighty-one eighty-two eighty-three eighty-four eighty-five eighty-six eighty-seven eighty-eight eighty-nine ninety ninety-one ninety-two ninety-three ninety-four ninety-five ninety-six ninety-seven ninety-eight ninety-nine one-hundred".split(" ").reverse();

let player;
let place;
let num;
let target;

function GetNumberOffOfStart(givenArray, givenString) {

    const reversedArray = numberWords.slice().reverse();

    if (parseInt(givenString.split(" ")[0]).toString() !== "NaN") {
        return [parseInt(givenString.split(" ")[0]), givenString.slice(givenString.split(" ")[0].length)];
    }
    let numberWord;

    for (let value of givenArray) {
        if (givenString.toLowerCase().startsWith(value) && (value.length > 1)) {
            numberWord = value
            givenString = givenString.slice(value.length)
        } else if (givenString.toLowerCase().startsWith(value.replace("-", " ")) && (value.length > 1)) {
            numberWord = value
            givenString = givenString.slice(value.length)
        } else if (givenString.toLowerCase().startsWith(value.replace(" ", "-")) && (value.length > 1)) {
            numberWord = value
            givenString = givenString.slice(value.length)
        } else if (givenString.split(" ")[0].toLowerCase() === value.toLowerCase()) {
            numberWord = value
            givenString = givenString.slice(value.length)
        }
    }

    if (numberWord) {
        numberWord = reversedArray.indexOf(numberWord) + 1
    }
    return [numberWord, givenString.trim()]
}

function juggle(value, playerData, location) {
    try {
        value = takeTheseOffThat(["juggle"], value).toLowerCase();
        player = playerData;
        place = location;
        [num, target] = GetNumberOffOfStart(numberWords, value)
        
        //edge cases
        if (!(juggleTime === undefined)) {
            socket.emit('green', "You are already juggling!");
            return false;
        } else if (value.toLowerCase() === "nothing") {
            socket.emit('emote', { user: player.characterName, emotion: "goofs around, pretending to juggle imaginary items.", location });
            return false;
        } else if (value.split(" ").length < 2 || num === undefined) {
            socket.emit('green', "How many, and what, are you trying to juggle?");
            return false;
        } else if (num < 1){
            socket.emit('green', "...you have to at LEAST try with one.");
            return false;
        }
        
        let itemName;
        //search for item in user inventory, determine if there are enough to juggle
        let potentialItems = 0;
        let potentialArray = [];
        for (const item of playerData.inventory) {
            itemName = item.item.itemName;
            // console.log(itemName);
            console.log(itemName, pluralizeAppropriateWords(target.toLowerCase(), 1).trim());
            console.log(itemName === pluralizeAppropriateWords(target.toLowerCase(), 1).trim());
            if (itemName === pluralizeAppropriateWords(target.toLowerCase().trim(), 1)) {
                if (((playerData.stats.DEX * 1.7) / (num ** 2)) < 2) {
                    console.log("DEX:", playerData.stats.DEX, "NUM:", num);
                    console.log(((playerData.stats.DEX * 1.7) / (num ** 2)))
                    if (item.quantity < num) {
                        socket.emit('green', `That may be too many objects for you to juggle. Besides... you only have ${item.quantity} of those.`);
                    } else {
                        socket.emit('green', 'That may be too many objects for you to juggle.');
                    }
                    return false;
                } else if (item.quantity >= num) {
                    socket.emit('juggle', { target: pluralizeAppropriateWords(target, num), num, user: playerData, location })
                    return true;
                } else {
                    socket.emit('green', `You don't have ${num} ${target} to juggle!`);
                    return false;
                }
            } else if ((itemName.startsWith(pluralizeAppropriateWords(target, 1))) || (itemName.endsWith(pluralizeAppropriateWords(target, 1)))) {
                potentialItems += item.quantity;
                potentialArray.push(itemName);
            }
        }
        if (potentialItems === 0) {
            socket.emit('green', `You don't seem to have any ${target} to juggle!`)
            return false;
        } else if (potentialItems > 0) {
            if (((playerData.stats.DEX * 1.7) / (num ** 2)) < 2) {
                if (potentialItems < num) {
                    socket.emit('green', `That may be too many objects for you to juggle. Besides... you only have ${potentialItems} of those.`);
                } else {
                    socket.emit('green', 'That may be too many objects for you to juggle.');
                }
                return false;
            } else if (potentialItems >= num) {
                if (potentialArray.length > 1) {
                    socket.emit('juggle', { target: pluralizeAppropriateWords(target, num), num, user: playerData, location });
                } else {
                    socket.emit('juggle', { target: pluralizeAppropriateWords(potentialArray[0], num), num, user: playerData, location });
                }
                return true;
            } else {
                socket.emit('green', `You don't have ${num} ${target} to juggle!`);
                return false;
            }
        }
        socket.emit('green', `How many ${target} are you trying to juggle?`);
        return false
    } catch (e) {
        socket.emit('failure', "Hmm... something seems to have gone wrong.")
        console.log("error from juggle");
        console.log(e.message);
    }

}



//send stopJuggling to socket
function stopJuggling(user, intent) {
    // console.log('sending a stop juggle');
    socket.emit('stop juggle', { user, location: place, target, intent })
}




//set difficulty of juggling based on dex and number of objects
function chancesOfSuccessJuggling(dex, num) {
    try {
        if (Math.floor(Math.random() * 10) > ((dex * 2) / (num ** 2))) {
            stopJuggling(player, false);
        }
    } catch (e) {
        console.log("error from chancesOfSuccessJuggling");
        console.log(e.message);
    }
}



socket.off('continueJuggle').on('continueJuggle', ({ target, num, user, location }) => {
    try {
        // console.log('recieved a continue juggle');
        juggleTime = setInterval(function () {
            socket.emit('contJuggle', { target, num, user, location });
            chancesOfSuccessJuggling(user.stats.DEX, num);
        }, 5000);
    } catch (e) {
        console.log("error from continueJuggle");
        console.log(e);
    }
})

function clearJuggleTime() {
    // console.log('INSIDE CLEAR INTERVAL');
    clearInterval(juggleTime);
    juggleTime = undefined;

}


export {
    juggle,
    stopJuggling,
    clearJuggleTime
}
