import { takeTheseOffThat } from "../../../clientUtilities/finders";

function getItem(inputString, locationData){
    inputString = takeTheseOffThat(["a", "an", "my", "the"], inputString);
    console.log(locationData);
    let potentialArray = [];
    for (const item of locationData.current.inventory){
        if ((item.name === inputString) && (item.quantity > 0)){
            return true;
        } else if ((item.name.endsWith(inputString)) || (item.name.startsWith(inputString))){
            if (item.quantity > 0){
                potentialArray.push(item.name);
            }
        }
    }
    if (potentialArray.length > 1){
        return potentialArray;
    } else if (potentialArray.length === 1){
        return potentialArray[0];
    } else {
        return false;
    }
}

function dropItem(inputString, playerData){
    inputString = takeTheseOffThat(["a", "an", "my", "the"], inputString);
    console.log(playerData);
    let potentialArray = [];
    for (const item of playerData.inventory){
        if ((item.name === inputString) && (item.quantity > 0)){
            return true;
        } else if ((item.name.endsWith(inputString)) || (item.name.startsWith(inputString))){
            if (item.quantity > 0){
                potentialArray.push(item.name);
            }
        }
    }
    if (potentialArray.length > 1){
        return potentialArray;
    } else if (potentialArray.length === 1){
        return potentialArray[0];
    } else {
        return false;
    }
}

export {
    getItem,
    dropItem,
}