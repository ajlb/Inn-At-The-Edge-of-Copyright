
function showInventory(user, setChatHistory) {
    console.log(user)
    const inventoryArray = [];
    const userInventory = user.inventory;

    userInventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${param.item.itemName}`);
    })

    if(inventoryArray.length === 0){
        setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `Your inventory is empty`}]);
        
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