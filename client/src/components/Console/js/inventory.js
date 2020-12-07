import pluralize from "pluralize";
import doesThisStartWithOneOfThese from "../../../clientUtilities/finders";
const MULTIPLES = ["set", "pair", "box", "bag", "bunch"];



//only pluralize things that don't start with multiples words
function pluralizeAppropriateWords(itemName, itemQuantity) {
    if (doesThisStartWithOneOfThese(itemName, MULTIPLES)) {
      if (itemQuantity > 1){
        for (const startWord of MULTIPLES){
          if (startWord.endsWith("ch") || startWord.endsWith("x")){
            itemName = itemName.replace(startWord, startWord+"es");
          } else {
            itemName = itemName.replace(startWord, startWord+"s");
          }
        }
      }
      return itemName;
    } else {
      return pluralize(itemName, itemQuantity);
    }
  }

function showInventory(user, setChatHistory) {
    const inventoryArray = [];
    const wearingArray = [];
    const userInventory = user.inventory;
    //const wornItems = user.wornItems;

    inventoryArray.push(`\xa0\xa0\xa0\xa0`);
    inventoryArray.push(`You are carrying: `);

    userInventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${pluralizeAppropriateWords(param.item.itemName, param.quantity)}`);
    })
    inventoryArray.push(`\xa0\xa0`);

    wearingArray.push(`You are wearing: `);

    for (const bodyLocation in user.wornItems ) {
        const slot = bodyLocation;
        const wearableItem = user.WornItems[bodyLocation];

        if (wearableItem){
          wearingArray.push(`${wearableItem} on your ${slot.slice(0, -5)}`);
        }

    }
    
      wearingArray.push(`\xa0\xa0\xa0\xa0`);


    if(inventoryArray.length === 0){
        setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `Your inventory is empty!`}]);
        
    }
    if(wearingArray.length === 0){
      setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `You appear to only be wearing underwear!`}]);
      
    }

    inventoryArray.forEach((item) => {
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `${item}` }]);
    });
    wearingArray.forEach((item) => {
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `${item}` }]);
    });
}

export {
    showInventory,
    pluralizeAppropriateWords
}