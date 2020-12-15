import { takeTheseOffThat } from "../../../clientUtilities/finders";
import { insertArticleSingleValue } from "../../../clientUtilities/parsers";

function getItem(socket, user, inputString, locationData) {
    let itemName;
    let itemId;
    inputString = takeTheseOffThat(["a", "an", "my", "the"], inputString);
    // console.log("GET: ", inputString);
    let potentialArray = [];
    for (const item of locationData.current.inventory) {
        // console.log(item);
        itemName = item.item.itemName;
        if ((itemName === inputString) && (item.quantity > 0)) {
            itemId = item.item._id;
            socket.emit('get', { target: itemName, itemId, user: user.characterName, location: locationData.current.locationName });
            return true;
        } else if ((itemName.endsWith(inputString)) || (itemName.startsWith(inputString))) {
            if (item.quantity > 0) {
                potentialArray.push(itemName);
                itemId = item.item._id;
            }
        }
    }
    if (potentialArray.length > 1) {
        socket.emit('green', `I'm not sure which you want to get. I think you might mean one of these - ${potentialArray.join(", ")}.`);
        return false;
    } else if (potentialArray.length === 1) {
        socket.emit('get', { target: potentialArray[0], itemId, user: user.characterName, location: locationData.current.locationName });
        return true;
    } else {
        socket.emit('green', `There doesn't seem to ${insertArticleSingleValue(inputString)} to get here.`);
        return false;
    }
}

function dropItem(socket, location, inputString, playerData) {
    let itemName;
    let itemId;
    inputString = takeTheseOffThat(["a", "an", "my", "the"], inputString);
    let potentialArray = [];
    for (const item of playerData.inventory) {
        itemName = item.item.itemName;
        if ((itemName === inputString) && (item.quantity > 0)) {
            itemId = item.item._id;
            socket.emit('drop', { target: itemName, itemId, user: playerData.characterName, location: location.current.locationName });
            return true;
        } else if ((itemName.endsWith(inputString)) || (itemName.startsWith(inputString))) {
            if (item.quantity > 0) {
                potentialArray.push(itemName);
                itemId = item.item._id;
            }
        }
    }
    if (potentialArray.length > 1) {
        socket.emit('green', `I'm not sure which you want to drop. I think you might mean one of these - ${potentialArray.join(", ")}.`);
        return false;
    } else if (potentialArray.length === 1) {
        socket.emit('drop', { target: potentialArray[0], itemId, user: playerData.characterName, location: location.current.locationName });
        return true;
    } else {
        socket.emit('green', `You don't seem to have ${insertArticleSingleValue(inputString)} to drop.`);
        return false;
    }
}


export {
    getItem,
    dropItem,
}