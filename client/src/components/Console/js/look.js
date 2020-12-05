
function lookAbout(location, setChatHistory) {
    console.log(location)
    const lookArray = [];
    const inventoryArray = [];
    const availableNPCs = [];

    location.current.inventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${param.item.itemName}`);
    })

    location.current.NPCs.forEach(npc => {
        availableNPCs.push(`${npc.primaryName}`)
    })

    const exitDescriptors = [];

    for (const exitPath in location.current.exits) {
        exitDescriptors.push(`moving to the ${exitPath} would take you to the ${location.current.exits[exitPath]}`);
    }

    lookArray.push(`${location.current.dayDescription}`);

    setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `${lookArray} ${exitDescriptors}` }]);
    if(availableNPCs.length >0) {
        setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `You may want to speak to ${availableNPCs}`}]);
    }
    if(inventoryArray.length > 0){
        inventoryArray.forEach((item) => {
            setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: `In the room someone has left ${item}`}]);
        })
    }

}



export {
    lookAbout
}