import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders";

function wear(input, playerData, wearCalls){
    console.log(playerData.inventory);
    const target = takeTheseOffThat(wearCalls, input).trim();
    console.log(target);
    const potentialArray = [];
    for (const item of playerData.inventory){
        console.log(item.name);
        if (item.name === target){
            socket.emit('wear', {user:playerData.characterName, item:target});
            return true;
        } else if (item.name.startsWith(target) || item.name.endsWith(target)){
            potentialArray.push(item.name);
        }
    }
    if (potentialArray.length === 0){
        socket.emit('green', `You don't seem to have a ${target} to wear!`)
        return false;
    } else if (potentialArray.length === 1){
        socket.emit('wear', {user:playerData.characterName, item:potentialArray[0]});
        return true;
    } else if (potentialArray.length > 1){
        socket.emit('green', `I'm not sure which item you want to wear. Perhaps one of these - ${potentialArray.join(", ")}.`);
        return false;
    }
}

function remove(input, playerData, removeCalls){
    return null
}

export {
    wear,
    remove
}