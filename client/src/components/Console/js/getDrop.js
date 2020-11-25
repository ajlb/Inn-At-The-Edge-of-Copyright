function getItem(inputString, locationData){
    let potentialArray = [];
    for (const item of locationData.current.inventory){
        if ((item.name === inputString) && (item.quantity > 0)){
            return true;
        } else if ((item.name.endsWith(inputString)) || (item.name.startsWith(inputString))){
            potentialArray.push(item.name);
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
    let potentialArray = [];
    for (const item of playerData.inventory){
        if ((item.name === inputString) && (item.quantity > 0)){
            return true;
        } else if ((item.name.endsWith(inputString)) || (item.name.startsWith(inputString))){
            potentialArray.push(item.name);
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