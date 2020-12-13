import { insertArticleSingleValue } from "../../../clientUtilities/parsers";

function eatItem(socket, input, player, locationName){
    try {
        if (input === ""){
            socket.emit('failure', `it looks like you didn't say what to eat!`);
        } else {
            let potentialArray = [];
            let itemName;
            let itemId;
            for (const item of player.inventory){
                // console.log(item);
                itemName = item.item.itemName;
                if (itemName){
                    if ((itemName === input) && (item.quantity > 0)){
                        itemId = item.item._id;
                        socket.emit('eat', { target:itemName, itemId, player: player.characterName, locationName });
                        return true;
                    } else if ((itemName.endsWith(input)) || (itemName.startsWith(input))){
                        if (item.quantity > 0){
                            potentialArray.push(itemName);
                            itemId = item.item._id;
                        }
                    }
                }
            }
            if (potentialArray.length > 1){
                socket.emit('green', `I'm not sure which item you want to eat. I think you might mean one of these - ${potentialArray.join(", ")}.`);
                return false;
            } else if (potentialArray.length === 1){
                socket.emit('eat', { target:potentialArray[0], itemId, player: player.characterName, locationName });
                return true;
            } else {
                socket.emit('green', `You don't seem to have ${insertArticleSingleValue(input)} to eat.`);
                return false;
            }
        }
    
    } catch (e) {
        console.log("ERROR FROM eatItem");
        console.log(e);
    }
}



export default eatItem;