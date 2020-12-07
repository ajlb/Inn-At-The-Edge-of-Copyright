import { pluralizeAppropriateWords } from "./inventory";




function lookAbout(location, setChatHistory) {
    const lookArray = [];
    const inventoryArray = [];
    const availableNPCs = [];

    location.current.inventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${pluralizeAppropriateWords(param.item.itemName, param.quantity)}`);
    })

    location.current.NPCs.forEach(npc => {
        availableNPCs.push(`${npc.primaryName}`)
    })

    // const exitDescriptors = [];

    // for (const exitPath in location.current.exits) {
    //     exitDescriptors.push(`moving to the ${exitPath} would take you to the ${location.current.exits[exitPath]}.`);
    // }

    lookArray.push(`${location.current.dayDescription}`);

    setChatHistory(prevState => [...prevState, {type:'displayed-stat', text: 'You look around:'}]);
    

    setChatHistory(prevState => [...prevState, { type: 'displayed-indent displayed-intro', text: `${lookArray}` }]);
    if (availableNPCs.length > 0) {
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `You may want to speak to ${availableNPCs}.` }]);
    }

    setChatHistory(prevState => [...prevState, { type: 'displayed-indent displayed-intro font-italic', text: `In the room someone has left: ${inventoryArray.join(", ")}.` }]);


}



export {
    lookAbout
}