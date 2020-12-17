function runExamine({ location, command, toExamine, user, setChatHistory }) {

    function isInDiscoverables(toExamine) {
        let itIs = false;
        if (location.current.discoverables) {
            let discoverables = location.current.discoverables;
            let description;
            let exampleCommand;
            discoverables.forEach(discoverable => {
                discoverable.names.forEach(name => {
                    if (name.startsWith(toExamine.toLowerCase()) && toExamine.trim() !== '') {
                        itIs = true;
                        description = discoverable.description;
                        exampleCommand = discoverable.exampleCommand;
                    }
                })
            })
        }
        return itIs;
    }

    function isInInventory(toExamine) {
        let foundItem = user.inventory.find(param => {
            return param.item.itemName.includes(toExamine.trim())
        })
        if (foundItem) {
            return true;
        } else {
            return false;
        }
    }

    function getAndDisplayInventoryItem(toExamine) {
        // console.log('getAndDisplayInventoryItem')
        let foundItem = user.inventory.find(param => {
            return param.item.itemName.includes(toExamine.trim())
        })
        if (foundItem) {
            setChatHistory(prevState => {
                return [...prevState, { type: 'displayed-stat mt-3', text: `In your inventory you see ${foundItem.item.description}` }]
            })
        } else {
            setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
        }
    }

    function isInLocationInventory(toExamine) {
        let foundItem = location.current.inventory.find(param => {
            return param.item.itemName.toLowerCase().includes(toExamine.trim())
        })
        if (foundItem) return true
        else return false
        // return true;
    }

    function getAndDisplayLocationItem(toExamine) {
        let foundItem = location.current.inventory.find(param => {
            return param.item.itemName.toLowerCase().includes(toExamine.trim())
        })
        if (foundItem) {
            setChatHistory(prevState => {
                return [...prevState, { type: 'displayed-stat mt-3', text: `Nearby you see ${foundItem.item.description}` }]
            })
        }
    }

    function isInFightables(toExamine) {
        let foundItem = location.current.fightables.find(param => {
            return param.name.toLowerCase().includes(toExamine.trim())
        })

        if (foundItem) return true
        else return false
    }

    function getAndDisplayFightable(toExamine) {
        let foundItem = location.current.fightables.find(param => {
            return param.name.toLowerCase().includes(toExamine.trim())
        })
        if (foundItem) {
            setChatHistory(prevState => {
                return [...prevState, { type: 'displayed-stat mt-3', text: foundItem.description }]
            })
        }
    }

    if (toExamine.trim() === '') {
        setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: `You didn't enter anything to ${command}! Try entering: ${command} <something>` }] })
    } else if (isInDiscoverables(toExamine)) {
        let discoverables = location.current.discoverables;
        let description;
        let exampleCommand;
        discoverables.forEach(discoverable => {
            discoverable.names.forEach(name => {
                if (name.startsWith(toExamine.toLowerCase()) && toExamine.trim() !== '') {
                    // console.log("You found the", name);
                    description = discoverable.description;
                    exampleCommand = discoverable.exampleCommand;
                }
            })
        })
        if (command === 'look out') {
            if (toExamine === 'window') {
                if (description) {
                    setChatHistory(prevState => {
                        if (exampleCommand) {
                            return [...prevState,
                            { type: 'displayed-stat mt-3', text: `You see ${description}` },
                            { type: 'displayed-commands', text: `Try entering: ${exampleCommand}` }]
                        } else {
                            return [...prevState, { type: 'displayed-stat mt-3', text: `Out the window you see ${description}` }]
                        }
                    })
                }
            } else {
                setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "You can't 'look out' that!" }] })
                setChatHistory(prevState => { return [...prevState, { type: "displayed-commands faded", text: `Try entering: look at ${toExamine} or look out window` }] })
            }
        } else if (description) {
            setChatHistory(prevState => {
                if (exampleCommand) {
                    return [...prevState,
                    { type: 'displayed-stat mt-3', text: `You see ${description}` },
                    { type: 'displayed-commands', text: `Try entering: ${exampleCommand}` }]
                } else {
                    return [...prevState, { type: 'displayed-stat mt-3', text: `You see ${description}` }]
                }
            })
        } else if (isInInventory(toExamine)) {
            getAndDisplayInventoryItem(toExamine)
        } else {
            setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
        }
    }
    else if (isInInventory(toExamine)) {
        getAndDisplayInventoryItem(toExamine)
    }
    else if (isInLocationInventory(toExamine)) {
        // console.log("found in location")
        getAndDisplayLocationItem(toExamine)
    }
    else if (isInFightables(toExamine)) {
        getAndDisplayFightable(toExamine)
    }
    else {
        setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
    }
}

export default runExamine;
