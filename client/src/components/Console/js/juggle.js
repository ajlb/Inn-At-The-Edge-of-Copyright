import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders"
import pluralize from "pluralize";

//this is the juggling interval
let juggleTime;

let numbers = { 0: ["zero", "0"], 1: ["one", "1"], 2: ["two", "2"], 3: ["three", "3"], 4: ["four", "4"], 5: ["five", "5"], 6: ["six", "6"], 7: ["seven", "7"], 8: ["eight", "8"], 9: ["nine", "9"], 10: ["ten", "10"], 11: ["eleven", "11"], 12: ["twelve", "12"], 13: ["thirteen", 13], 14: ["fourteen", "14"], 15: ["fifteen", "15"], 16: ["sixteen", "16"], 17: ["seventeen", "17"], 18: ["eighteen", "18"], 19: ["nineteen", "19"], 20: ["twenty", "20"], 50: ["fifty", "50"], 100: ["one hundred", "100"] }

let player;
let place;
let num;
let target;

function juggle(value, playerData, location) {
    try {
        if (!(juggleTime === undefined)){
            socket.emit('green', "You are already juggling!");
            return false;
        }
        if (value.split(" ").length < 3) {
            socket.emit('green', "How many, and what, are you trying to juggle?");
        }
        value = takeTheseOffThat(["juggle"], value).toLowerCase();
        player = playerData;
        place = location;
        num = value.split(" ")[0];
        target = value.replace(`${num} `, "");
        let itemName;
        //turn typed number into int
        for (const property in numbers) {
            if (numbers[property].includes(num.toLowerCase())) {
                const intNum = parseInt(property);
                if (typeof intNum === "number" && intNum > 2) {
                    //search for item in user inventory, determine if there are enough to juggle
                    let potentialItems = 0;
                    let potentialArray = [];
                    for (const item of playerData.inventory) {
                        itemName = item.item.itemName;
                        console.log(itemName);
                        if (itemName === pluralize(target.toLowerCase(), 1)) {
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
                        } else if ((itemName.startsWith(pluralize(target, 1))) || (itemName.endsWith(pluralize(target, 1)))) {
                            potentialItems += item.quantity;
                            potentialArray.push(itemName);
                        }
                    }
                    if (potentialItems === 0) {
                        socket.emit('green', `You don't seem to have any ${target} to juggle!`)
                        return false;
                    } else if (potentialItems > 0) {
                        if (((playerData.stats.DEX * 1.7) / (num ** 2)) < 2) {
                            socket.emit('green', 'That may be too many objects for you to juggle.')
                            return false;
                        } else if (potentialItems >= intNum) {
                            if (potentialArray.length > 1){
                                socket.emit('juggle', { target, num, user: playerData, location });
                            } else {
                                socket.emit('juggle', { target:pluralize(potentialArray[0], 3), num, user: playerData, location });
                            }
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
    } catch (e) {
        socket.emit('failure', "Hmm... something seems to have gone wrong.")
        console.log("error from juggle");
        console.log(e);
    }

}



//send stopJuggling to socket
function stopJuggling(user, intent) {
    // console.log('sending a stop juggle');
    socket.emit('stop juggle', {user, location:place, target, intent})
}




//set difficulty of juggling based on dex and number of objects
function chancesOfSuccessJuggling(dex, num) {
    try {
        if (Math.floor(Math.random() * 10) > ((dex * 2) / (num ** 2))) {
            stopJuggling(player, false);
        }
    } catch (e) {
        console.log("error from chancesOfSuccessJuggling");
        console.log(e);
    }
}



socket.off('continueJuggle').on('continueJuggle', ({target, num, user, location})=>{
    try {
        // console.log('recieved a continue juggle');
        juggleTime = setInterval(function(){
            socket.emit('contJuggle', {target, num, user, location});
            chancesOfSuccessJuggling(user.stats.DEX, num);
        }, 5000);
    } catch (e) {
        console.log("error from continueJuggle");
        console.log(e);
    }
})

function clearJuggleTime(){
    // console.log('INSIDE CLEAR INTERVAL');
    clearInterval(juggleTime);
    juggleTime = undefined;
    
}


export {
    juggle,
    stopJuggling,
    clearJuggleTime
}
