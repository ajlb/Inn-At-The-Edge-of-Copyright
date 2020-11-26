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
    console.log(`num ${num}, target ${target}`);
    //turn typed number into int
    for (const property in numbers) {
        console.log(typeof num);
        console.log(num, numbers[property].includes(num.toLowerCase()));
        if (numbers[property].includes(num.toLowerCase())) {
            const intNum = parseInt(property);
            if (typeof intNum === "number" && intNum > 2) {
                //search for item in user inventory, determine if there are enough to juggle
                let potentialArray = [];
                for (const item of playerData.inventory) {
                    if (item.name === pluralize(target, 1)) {
                        if (((playerData.stats.DEX * 2) / (intNum ** 2)) < 2) {
                            socket.emit('green', 'That may be too many objects for you to juggle.')
                            return false;
                        } else if (item.quantity >= intNum) {
                            socket.emit('juggle', { target, intNum, user: playerData, location })
                            return true;
                        } else {
                            socket.emit('green', `You don't have ${intNum} ${target} to juggle!`);
                            return false;
                        }
                    } else if ((item.name.startsWith(pluralize(target, 1))) || (item.name.endsWith(pluralize(target, 1)))) {
                        potentialArray.push(item.name);
                    }
                }
                if (potentialArray.length === 0) {
                    socket.emit('green', `You don't seem to have any ${target} to juggle!`)
                    return false;
                } else if (potentialArray.length === 1) {
                    socket.emit('juggle', { target, num, user: playerData, location })
                    return true;
                } else if (potentialArray.length > 1) {
                    socket.emit('green', `I'm not sure which items you want to juggle. I think you might mean one of these - ${potentialArray.join(", ")}.`);
                    return false;
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
    console.log('sending out a stop juggle announcement');
    socket.emit('stop juggle', {user, location:place, target, intent})
}




//set difficulty of juggling based on dex and number of objects
function chancesOfSuccessJuggling(dex, num) {
    console.log(`Chancing. Dex: ${dex}, Num: ${num}`);
    if (Math.floor(Math.random() * 10) > ((dex * 2) / (num ** 2))) {
        stopJuggling(player, false);
    }
}



//this is the juggling interval
let juggleTime;

socket.off('continueJuggle').on('continueJuggle', ({target, num, user, location})=>{
    console.log('continue juggle');
    juggleTime = setInterval(function(){
        console.log('juggling');
        socket.emit('contJuggle', {target, num, user, location});
        chancesOfSuccessJuggling(user.stats.DEX, num);
    }, 2000);
})

function clearJuggleTime(){
    clearInterval(juggleTime);
}


export {
    juggle,
    stopJuggling,
    clearJuggleTime
}
