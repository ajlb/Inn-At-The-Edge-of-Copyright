import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders"
import pluralize from "pluralize";

let numbers = { 0: ["zero", "0"], 1: ["one", "1"], 2: ["two", "2"], 3: ["three", "3"], 4: ["four", "4"], 5: ["five", "5"], 6: ["six", "6"], 7: ["seven", "7"], 8: ["eight", "8"], 9: ["nine", "9"], 10: ["ten", "10"], 11: ["eleven", "11"], 12: ["twelve", "12"], 13: ["thirteen", 13], 14: ["fourteen", "14"], 15: ["fifteen", "15"], 16: ["sixteen", "16"], 17: ["seventeen", "17"], 18: ["eighteen", "18"], 19: ["nineteen", "19"], 20: ["twenty", "20"], 50: ["fifty", "50"], 100: ["one hundred", "100"] }

let player;
let place;
let num;
let target;

function juggle(value, playerData, location) {
    if (value.split(" ").length < 3) {
        socket.emit('green', "How many, and what, are you trying to juggle?");
    }
    value = takeTheseOffThat(["juggle"], value).toLowerCase();
    player = playerData;
    place = location;
    num = value.split(" ")[0];
    target = value.replace(`${num} `, "");
    //turn typed number into int
    for (const property in numbers) {
        if (numbers[property].includes(num.toLowerCase())) {
            const intNum = parseInt(property);
            if (typeof intNum === "number" && intNum > 2) {
                //search for item in user inventory, determine if there are enough to juggle
                let potentialItems = 0;
                for (const item of playerData.inventory) {
                    if (item.name === pluralize(target, 1)) {
                        if (((playerData.stats.DEX * 1.7) / (num ** 2)) < 2) {
                            socket.emit('green', 'That may be too many objects for you to juggle.')
                            return false;
                        } else if (item.quantity >= num) {
                            socket.emit('juggle', { target, num, user: playerData, location })
                            return true;
                        } else {
                            socket.emit('green', `You don't have ${num} ${target} to juggle!`);
                            return false;
                        }
                    } else if ((item.name.startsWith(pluralize(target, 1))) || (item.name.endsWith(pluralize(target, 1)))) {
                        potentialItems += item.quantity;
                    }
                }
                if (potentialItems === 0) {
                    socket.emit('green', `You don't seem to have any ${target} to juggle!`)
                    return false;
                } else if (potentialItems > 0) {
                    if (((playerData.stats.DEX * 1.7) / (num ** 2)) < 2) {
                        socket.emit('green', 'That may be too many objects for you to juggle.')
                        return false;
                    } else if (potentialItems >= num) {
                        socket.emit('juggle', { target, num, user: playerData, location });
                        return true;
                    } else {
                        socket.emit('green', `You don't have ${num} ${target} to juggle!`);
                        return false;
                    }
                }

            } else {
                socket.emit('green', `You have to juggle at least three items.`);
            }
        }
    }
    socket.emit('green', `How many ${target} are you trying to juggle?`);
    return false

}



//send stopJuggling to socket
function stopJuggling(user, intent) {
    socket.emit('stop juggle', {user, location:place, target, intent})
}




//set difficulty of juggling based on dex and number of objects
function chancesOfSuccessJuggling(dex, num) {
    if (Math.floor(Math.random() * 10) > ((dex * 2) / (num ** 2))) {
        stopJuggling(player, false);
    }
}



//this is the juggling interval
let juggleTime;

socket.off('continueJuggle').on('continueJuggle', ({target, num, user, location})=>{
    juggleTime = setInterval(function(){
        socket.emit('contJuggle', {target, num, user, location});
        chancesOfSuccessJuggling(user.stats.DEX, num);
    }, 5000);
})

function clearJuggleTime(){
    clearInterval(juggleTime);
}


export {
    juggle,
    stopJuggling,
    clearJuggleTime
}
