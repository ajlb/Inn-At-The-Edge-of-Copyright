let numbers = {0: ["zero", "0"], 1: ["one", "1"], 2: ["two", "2"], 3: ["three", "3"], 4: ["four", "4"], 5:["five", "5"], 6:["six", "6"], 7:["seven", "7"], 8:["eight", "8"], 9:["nine", "9"], 10:["ten", "10"], 11: ["eleven", "11"], 12: ["twelve", "12"], 13:["thirteen", 13], 14:["fourteen", "14"], 15:["fifteen", "15"], 16:["sixteen", "16"], 17:["seventeen", "17"], 18:["eighteen", "18"], 19:["nineteen", "19"], 20:["twenty", "20"], 50:["fifty", "50"], 100:["one hundred", "100"]}

let juggleTime = false;
let juggledItem;


function juggle(value){
    if (value.split(" ").length < 3){
        logThis("How many, and what, are you trying to juggle?");
    }
    value = takeTheseOffThat(actionCalls.juggle, value);
    let num = value.split(" ")[0];
    let target = value.replace(`${num} `, "");
    //turn typed number into int
    for (prop in numbers){
        if (numbers[prop].includes(num.toLowerCase())){
            num = parseInt(prop);
            if (typeof num === "number" && num > 2){  
                //search for item in user inventory, determine if there are enough to juggle
                getInventory(currentUserId).then(userInventory => {
                    findMatchByItemName(pluralize(target, 1), userInventory).then(matchSuccess=>{
                        if (((currentUserData.DEX*2)/(num**2))<2){
                            logThis('That may be too many objects for you to juggle.')
                        } else if (matchSuccess && (matchSuccess.quantity >= num)){
                            publishDescription(`starts juggling ${num} ${target}.`)
                            juggledItem = pluralize(target, 1);
                            setTimeout(continueJuggle(num, target), 4000);
                        } else {
                            logThis(`You don't have ${num} ${target} to juggle!`);
                            return false;
                        }
                    })
                })
            } else {
                logThis(`How many ${target} are you trying to juggle?`);
                return false;
            }
            break
        } 
    }

}

//set difficulty of juggling based on dex and number of objects
function chancesOfSuccessJuggling(dex, num){
    if (Math.floor(Math.random()*10)>((dex*2)/(num**2))){
        stopJuggling(true);
    }
}

//see whether juggle continues
function continueJuggle(num, target){
    juggleTime = setInterval(function(){
        publishDescription(`juggles ${num} ${target}.`);
        chancesOfSuccessJuggling(currentUserData.DEX, num);
    }, 4000);
}

//end juggle, increment dex if appropriate
function stopJuggling(dropped){
    clearInterval(juggleTime);
    if (!(juggleTime)){
        logThis("You're not juggling!");
    } else {
        if (dropped){
            publishDescription(`drops their ${pluralize(juggledItem, 3)} and scrambles around after them.`)
            incrementStat('DEX', 0.25, currentUserData.characterName);
        } else {
            publishDescription(`stops juggling.`)
        }
        juggleTime = false;
    }
}