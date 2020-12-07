function runExamine({ input, location, command, toExamine, user, setChatHistory }) {
    console.log("You are attempting to examine", toExamine)

    if (location.current.discoverables && toExamine.trim() !== '') {
        console.log('inside the location discoverables if');
        let discoverables = location.current.discoverables;
        let description;
        let exampleCommand;
        discoverables.forEach(discoverable => {
            discoverable.names.forEach(name => {
                if (name.startsWith(toExamine.toLowerCase()) && toExamine.trim() !== '') {
                    console.log("You found the", name);
                    description = discoverable.description;
                    exampleCommand = discoverable.exampleCommand;
                }
            })
        })
        if (description) {
            setChatHistory(prevState => {
                if (exampleCommand) {
                    return [...prevState,
                    { type: 'displayed-stat', text: `You see ${description}` },
                    { type: 'displayed-commands', text: `Try entering: ${exampleCommand}` }]
                } else {
                    return [...prevState, { type: 'displayed-stat', text: `You see ${description}` }]
                }
            })
        } else {
            console.log("couldn't find a location discoverable");
            setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
        }
    } else if (toExamine.trim() === '') {
        console.log('You did not put in anything to examine');
        setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: `You didn't enter anything to ${command}! Try entering: ${command} <something>` }] })

    } else {
        console.log("I'm going to look for it in inventory");
        let foundItem = user.inventory.find(param => {
            return param.item.itemName.includes(toExamine.trim())
        })
        console.log('foundItem');
        if (foundItem) {
            setChatHistory(prevState => {
                return [...prevState, { type: 'displayed-stat', text: `In your inventory you see ${foundItem.item.description}` }]
            })
        } else {
            setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
        }
    }
}

export default runExamine;
