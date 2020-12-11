import { pluralizeAppropriateWords } from "./inventory";




function lookAbout(location, setChatHistory) {
    const lookArray = [];
    const inventoryArray = [];
    const availableNPCs = [];
    const fightables = location.current.fightables;

    location.current.inventory.forEach(param => {
        inventoryArray.push(`${param.quantity} ${pluralizeAppropriateWords(param.item.itemName, param.quantity)}`);
    })

    location.current.NPCs.forEach(npc => {
        availableNPCs.push(`${npc.primaryName}`)
    })

    const exitDescriptors = [];

    for (const exitPath in location.current.exits) {
        exitDescriptors.push(`${exitPath}`);
    }

    lookArray.push(`${location.current.dayDescription}`);

    setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: 'You look around:' }]);


    setChatHistory(prevState => [...prevState, { type: 'displayed-indent displayed-intro', text: `${lookArray}` }]);
    if (availableNPCs.length > 0) {
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `You may want to speak to ${availableNPCs}.` }]);
    }

    if (fightables) {
        console.log(fightables);
        if (fightables.length > 1) {
            const fightList = [];
            for (const monsterObject of fightables) {
                fightList.push(monsterObject);
            }
            console.log(fightList);
            setChatHistory(prevState => [...prevState, {
                type: 'displayed-stat', text: `You see some creatures prowling around this area: <span className='text-warning'>${fightList.filter(en => {
                    return (en.isAlive);
                }).map(en => {
                    return en.name;
                }).join(", ")}</span>.`
            }]);

        }
    }

    setChatHistory(prevState => [...prevState, { type: 'displayed-indent displayed-intro font-italic', text: `Exits: ${exitDescriptors.join(", ")}.` }]);

    if (inventoryArray.length > 0) {
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent displayed-intro font-italic', text: `In the room someone has left: ${inventoryArray.join(", ")}.` }]);
    }


}



export {
    lookAbout
}