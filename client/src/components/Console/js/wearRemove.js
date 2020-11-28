import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders";

function wear(input, playerData, wearCalls){
    console.log(playerData.inventory);
    input = takeTheseOffThat(wearCalls, input).split(" on ");
    const inputItem = input[0];
    const targetSlot = input.length > 1 ? input[1] : false;
    console.log(inputItem);
    const potentialArray = [];
    for (const item of playerData.inventory){
        console.log(item.name);
        if (item.name === inputItem){
            socket.emit('wear', {user:playerData.characterName, item:inputItem, targetSlot});
            return true;
        } else if (item.name.startsWith(inputItem) || item.name.endsWith(inputItem)){
            potentialArray.push(item.name);
        }
    }
    if (potentialArray.length === 0){
        socket.emit('green', `You don't seem to have a ${inputItem} to wear!`)
        return false;
    } else if (potentialArray.length === 1){
        socket.emit('wear', {user:playerData.characterName, item:potentialArray[0], targetSlot});
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