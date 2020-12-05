import pluralize from "pluralize";

function showInventory(user, setChatHistory) {
    console.log(user)
    const inventoryArray = [];
    const userInventory = user.inventory;

    inventoryArray.push(`\xa0\xa0\xa0\xa0`);
    inventoryArray.push(`You are carrying: `);

    userInventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${pluralize(param.item.itemName, param.quantity)}`);
    })
    inventoryArray.push(`\xa0\xa0\xa0\xa0`);


    if(inventoryArray.length === 0){
        setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `Your inventory is empty!`}]);
        
    }

    // const deletedItems = inventoryArray.slice(0, 4);
    // const newDeletedItems = inventoryArray.slice(8, 10);

    // const newArray = deletedItems.concat(newDeletedItems)

    inventoryArray.forEach((item) => {

        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `${item}` }]);
        // console.log(newArray);


    });
}

export {
    showInventory
}