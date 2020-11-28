import socket from "../../../clientUtilities/socket";
import { takeTheseOffThat } from "../../../clientUtilities/finders";
import { insertArticleSingleValue } from "../../../clientUtilities/parsers";


//wear is erroring in two known ways - cannot wear dagger in a specified hand slot, and when multiple potential slots exists and none is specified, no slots are printed in the message.
function wear(input, playerData, wearCalls) {

    input = takeTheseOffThat(wearCalls, input);
    input = takeTheseOffThat(["a", "the", "an", "my", "these"], input);
    if (input.indexOf(" on ") >= 0) {
        input = input.split(" on ");
    } else {
        input = input.split(" in ");
    } 
    const inputItem = input[0].toLowerCase();
    let targetWords = input.length > 1 ? input[1] : false;
    targetWords = targetWords ? takeTheseOffThat(["my", "the"], targetWords) : false;
    const potentialArray = [];
    for (const item of playerData.inventory) {
        if (item.name.toLowerCase() === inputItem) {
            socket.emit('wear', { user: playerData.characterName, item: inputItem, targetWords });
            return true;
        } else if (item.name.startsWith(inputItem) || item.name.endsWith(inputItem)) {
            potentialArray.push(item.name);
        }
    }
    if (potentialArray.length === 0) {
        socket.emit('green', `You don't seem to have ${insertArticleSingleValue(inputItem)} to wear!`)
        return false;
    } else if (potentialArray.length === 1) {
        socket.emit('wear', { user: playerData.characterName, item: potentialArray[0], targetWords });
        return true;
    } else if (potentialArray.length > 1) {
        socket.emit('green', `I'm not sure which item you want to wear. Perhaps one of these - ${potentialArray.join(", ")}.`);
        return false;
    }
}

function remove(input, playerData, removeCalls) {
    input = takeTheseOffThat(removeCalls, input);
    input = takeTheseOffThat(["a", "the", "an", "my", "these"], input).split(" from ");
    const inputItem = input[0].toLowerCase();
    let targetWords = input.length > 1 ? input[1] : false;
    targetWords = targetWords ? takeTheseOffThat(["my", "the"], targetWords) : false;
    const targetSlot = targetWords ? targetWords.replace(/\s/g, "").toLowerCase() : false;
    console.log(`targetSlot: ${targetSlot}`);
    console.log(`inputItem: ${inputItem}`);
    let potentialArray = [];
    let itemMatches = [];
    console.log("------------");
    console.log("------------");

    for (const slot in playerData.wornItems) {
        console.log(slot, playerData.wornItems[slot]);
        if (playerData.wornItems[slot] === inputItem) {
            potentialArray.push(slot);
            if ((slot.toLowerCase() === (targetSlot + 'slot')) || (targetSlot === false)) {
                console.log("first if");
                socket.emit('remove', { user: playerData.characterName, item: inputItem, targetSlot:slot });
                return true;
            }
        } else if (!(playerData.wornItems[slot] === null)) {
            console.log("second if");
            if (((playerData.wornItems[slot].startsWith(inputItem)) || (playerData.wornItems[slot].endsWith(inputItem))) && (slot.toLowerCase() === (targetSlot + 'slot'))) {
                console.log("if 2.1");
                socket.emit('remove', { user: playerData.characterName, item: playerData.wornItems[slot], targetSlot:slot });
                return true;
            } else if (((playerData.wornItems[slot].startsWith(inputItem)) || (playerData.wornItems[slot].endsWith(inputItem))) && (targetSlot === false)) {
                console.log("if 2.2");
                console.log("---partial match---");
                itemMatches.push(playerData.wornItems[slot]);
                console.log("-----");
            }

        }
    }
    if (itemMatches.length === 1) {
        console.log(potentialArray);
        socket.emit('remove', { user: playerData.characterName, item: itemMatches[0], targetSlot: potentialArray[0] });
        return true;
    } else if (itemMatches.length > 1) {
        socket.emit('green', `You seem to be wearing multiple items matching that description - ${itemMatches.join(", ")}. Perhaps try examining yourself to see what you're wearing?`);
        return false;
    }
    if (potentialArray.length === 0) {
        socket.emit('green', `You don't seem to be wearing ${insertArticleSingleValue(inputItem)}!`)
        return false;
    } else if (potentialArray.length === 1) {
        let placeOfExistence = potentialArray[0].slice(0, -4);
        switch (placeOfExistence) {
            case "rightHand":
                placeOfExistence = "in your right hand";
                break;
            case "leftHand":
                placeOfExistence = "in your left hand";
                break;
            case "twoHands":
                placeOfExistence = "in your two hands";
                break;
            default:
                placeOfExistence = "on your " + placeOfExistence;
                break;
        }
        socket.emit('green', `Your ${inputItem} is not on your ${targetWords}, it's ${placeOfExistence}`);
        return false;
    } else if (potentialArray.length > 1) {
        potentialArray = potentialArray.filter(slot => {
            slot = slot.slice(0, -4);
            switch (slot) {
                case 'rightHand':
                    slot = 'right hand';
                    break;
                case 'leftHand':
                    slot = 'left hand';
                    break;
                case 'twoHands':
                    slot = 'two hands';
                    break;
                default:
                    break;
            }
            return slot;
        })
        socket.emit('green', `I'm not sure where you want to remove that from. Perhaps one of these - ${potentialArray.join(", ")}.`);
        return false;
    }
}

export {
    wear,
    remove
}