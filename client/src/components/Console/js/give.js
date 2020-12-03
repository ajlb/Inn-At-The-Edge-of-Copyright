import { takeTheseOffThat } from "../../../clientUtilities/finders";
import { insertArticleSingleValue } from "../../../clientUtilities/parsers";

function giveItem(socket, inputString, target, playerData, location) {
    inputString = takeTheseOffThat(["a", "an", "my", "the"], inputString);
    let itemName;
    let itemId;
    let potentialArray = [];
    for (const item of playerData.inventory) {
        itemName = item.item.itemName;
        if ((itemName === inputString) && (item.quantity > 0)) {
            itemId = item.item._id;
            socket.emit('give', { target, item:itemName, itemId, user: playerData.characterName, location: location.current.locationName });
            return true;
        } else if ((itemName.endsWith(inputString)) || (itemName.startsWith(inputString))) {
            if (item.quantity > 0) {
                itemId = item.item._id;
                potentialArray.push(itemName);
            }
        }
    }
    if (potentialArray.length > 1) {
    socket.emit('green', `I'm not sure which item you want to give. I think you might mean one of these - ${potentialArray.join(", ")}.`);
        return false;
    } else if (potentialArray.length === 1) {
        socket.emit('give', { target, item:potentialArray[0], itemId, user: playerData.characterName, location: location.current.locationName });
        return true;
    } else {
    socket.emit('green', `You don't seem to have ${insertArticleSingleValue(inputString)} to give.`);
        return false;
    }
}

export {
    giveItem
}