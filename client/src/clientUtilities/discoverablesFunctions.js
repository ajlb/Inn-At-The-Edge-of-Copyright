import processMove from '../components/Console/js/move';
import runExamine from "../components/Console/js/examine";
import { wear as realWear } from "../components/Console/js/wearRemove";

/* ---------Global Variables----------*/
let startDoorisLocked = true;
let hasStartKey = false;
let wardrobeIsOpen = false;
let wardrobeList = [];
let playerStartRoomInventory = [];
let playerStartRoomWearing = [];


const discFunctions = {
    "Library": {
        /*****************************/
        /*         Library           */
        /*****************************/

        pullBook: function pullBook({ socket, location, user, playerPosition, setChatHistory, actionCalls, command }) {
            setTimeout(() => {
                processMove(socket, location, user, "move south", playerPosition, setChatHistory, actionCalls, command, true)
            }, 1000)
        }

    },


    "Inn Laundry Room": {
        /*****************************/
        /*      Inn Laundry Room     */
        /*****************************/

        mousehole: function mousehole({ socket, location, user, playerPosition, setChatHistory, actionCalls, command }) {
            setTimeout(() => {
                processMove(socket, location, user, "move west", playerPosition, setChatHistory, actionCalls, command, true)
            }, 1000)
        }

    },


    "Start Room": {
        /*****************************/
        /*         Start Room        */
        /*****************************/

        unlockDoor: function unlockDoor({ setChatHistory, isSleeping, playerPosition }) {
            if (!isSleeping) {
                if (playerPosition !== 'lying down') {
                    setTimeout(() => {
                        if (hasStartKey) {
                            startDoorisLocked = false;
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-3", text: "The silver latch unlocks and falls to the floor! Though the door swings open, it seems like you broke your key in the lock..." }]);
                            setChatHistory(prevState => [...prevState, { type: "displayed-commands", text: "Try entering: move east" }]);
                        } else {
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "It seems the door needs a special key to unlock" }]);
                        }
                    }, 500)
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You can't do that while you're lying down!" }]);
                }
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
            }
        },

        openWardrobe: function openWardrobe({ setChatHistory, isSleeping, playerPosition }) {
            if (!isSleeping) {
                if (playerPosition !== 'lying down') {
                    setTimeout(() => {
                        if (wardrobeIsOpen) {
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "The wardrobe is already open!" }]);
                        } else {
                            wardrobeIsOpen = true;
                            wardrobeList = ['a pair of brown pants']
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-3", text: "As you tentatively open the wardrobe, a cloud of dust billows out of the doors causing you to cough." }]);
                            setChatHistory(prevState => [...prevState, { type: "displayed-commands", text: "Try entering: look" }]);
                        }
                    }, 500)
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You can't do that while you're lying down!" }]);
                }
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
            }
        },

        look: function look({ setChatHistory, location, isSleeping }) {
            if (!isSleeping) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-3", text: location.current.dayDescription }]);
                if (wardrobeIsOpen && wardrobeList.length > 0) {
                    let inWardrobe = wardrobeList;
                    if (inWardrobe.length > 2) {
                        inWardrobe[inWardrobe.length - 1] = `and ${inWardrobe[inWardrobe.length - 1]}`
                        inWardrobe = inWardrobe.join(', ')
                    } else if (inWardrobe.length > 1) {
                        inWardrobe = inWardrobe.join(' and ')
                    } else {
                        inWardrobe = inWardrobe[0]
                    }
                    let firstItemSplit = wardrobeList[0].split(' ');
                    let lastWord = firstItemSplit[firstItemSplit.length - 1];
                    setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: `In the wardrobe you see ${inWardrobe}` }]);
                    setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: `Try entering: pick up ${lastWord}` }]);
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: `Try entering: look in mirror or examine wardrobe` }]);
                }
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
            }
        },

        examine: function examine({ location, command, user, setChatHistory, input }) {
            let toExamine = input;
            // console.log(toExamine)
            function isAllowed(toExamine) {
                let itIs = false;
                wardrobeList.forEach(item => {
                    if (item.includes(toExamine)) {
                        itIs = true;
                    }
                })
                location.current.discoverables.forEach(discObj => {
                    if (discObj.names.includes(toExamine)) {
                        itIs = true;
                    }
                })
                if (toExamine === 'window') {
                    itIs = true;
                }
                return itIs;
            }
            if (isAllowed(toExamine)) {
                runExamine({ location, command, toExamine, user, setChatHistory })
            } else if (toExamine === '') {
                setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: `You didn't enter anything to ${command}! Try entering: ${command} <something>` }] })
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: "There's nothing by that name here" }]);
            }
        },

        help: function help({ setChatHistory, input, socket }) {
            // console.log(input)
            if (input.trim() === '') {
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `HELP` }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);

                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(help) -  Try entering: help <command>' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(examine) -  Look closely at something' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(get) -  Pick up an item' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(look) -  Look around you' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(move) -  Move through an exit' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(inventory) -  Check your inventory' }]);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: '(wear) -  Put on a wearable item' }]);
            } else {
                socket.emit("help", { message: input })
            }
        },

        get: function get({ setChatHistory, input, socket, user, isSleeping, playerPosition }) {
            if (!isSleeping && playerPosition !== "lying down") {
                let isInWardrobeList = false;
                if (wardrobeList.length > 0) {
                    wardrobeList.forEach(item => {
                        if (item.includes(input)) {
                            isInWardrobeList = item
                        }
                    })
                    if (isInWardrobeList) {
                        let itemIndex = wardrobeList.indexOf(isInWardrobeList);
                        wardrobeList.splice(itemIndex, 1);
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `You pick up ${isInWardrobeList}` }]);
                        if (isInWardrobeList === 'a pair of brown pants') {
                            socket.emit('discoverable', { itemName: "pair of brown pants", socketProp: 'hasStartPants', discFunction: 'discGet', itemID: "5fc32531b2009d226ef5b85e", user, quiet: true });
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-2", text: "Hiding underneath the pair of brown pants you see a shiny key" }]);
                            wardrobeList.push('a shiny key');
                        }
                        if (isInWardrobeList === 'a shiny key') {
                            hasStartKey = true;
                            setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: inventory" }]);
                        }
                        playerStartRoomInventory.push(isInWardrobeList)
                    }
                }
                if (!isInWardrobeList) {
                    setChatHistory(prevState => [...prevState, { type: "displayed-error", text: "There's nothing here by that name" }]);
                }
            } else if (playerPosition === 'lying down') {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You can't do that while you're lying down!" }]);
            } else if (isSleeping) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
            }
        },

        wear: function wear({ command, setChatHistory, input, playerPosition, isSleeping, user }) {
            let isInInventory = false;
            playerStartRoomInventory.forEach((item, index) => {
                if (item !== 'a shiny key') {
                    if (item.includes(input)) {
                        isInInventory = true;
                        playerStartRoomInventory.splice(index, 1);
                        playerStartRoomWearing.push(item)
                    }
                }
            })
            if (input && input.trim() !== '' && playerPosition !== 'lying down' && !isSleeping && isInInventory) {
                // console.log(`Attempting to ${command} ${input}`)
                realWear(input, user, ['wear'])
            } else if (isSleeping) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
                setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: wake up" }]);
            } else if (playerPosition === 'lying down') {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You can't do that while you're lying down!" }]);
                setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: stand up" }]);
            } else if (!isInInventory) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You don't have anything by that name to wear!" }]);
            } else {
                setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: `You didn't enter anything to ${command}! Try entering: ${command} <something>` }] })
            }
        },

        inventory: function inventory({ setChatHistory }) {
            setChatHistory(prevState => [...prevState, { type: "displayed-indent mt-4 mb-2", text: `You are carrying${playerStartRoomInventory.length >= 1 ? ':' : " nothing"}` }]);

            playerStartRoomInventory.forEach(item => {
                setChatHistory(prevState => [...prevState, { type: "displayed-indent", text: item }]);
            })
            if (playerStartRoomWearing.length >= 1) {
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent my-3', text: `You are wearing:` }]);
                playerStartRoomWearing.forEach(item => {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `${item}` }]);
                })
            } else {
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent mt-3', text: `You appear to only be wearing underwear!` }]);
            }
        },

        moveEast: function moveEast({ socket, command, location, user, playerPosition, setChatHistory, actionCalls, isSleeping }) {
            if (!isSleeping && playerPosition === 'standing' && playerStartRoomWearing.includes('a pair of brown pants')) {
                setTimeout(() => {
                    if (startDoorisLocked) {
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "Looks like the door is locked! If only you had a  key..." }]);
                    } else {
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-3", text: "You step through the wooden doorframe, the floorboards creaking beneath your feet. The door suddenly slams behind you!" }]);
                        processMove(socket, location, user, "move east", playerPosition, setChatHistory, actionCalls, command)
                    }
                }, 500)
            } else if (playerPosition !== 'standing') {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to be standing to do that!" }]);
            } else if (isSleeping) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "You need to wake up to do that!" }]);
            } else if (!playerStartRoomWearing.includes('a pair of brown pants')) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red mt-2", text: "You should probably put on some clothes before you do that!" }]);
                setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: wear pants" }]);
            }
        }

    },


    "Inn Kitchen": {
        /*****************************/
        /*        Inn Kitchen        */
        /*****************************/

        getLadle: function getLadle({ socket, location, user, playerPosition, setChatHistory, actionCalls }) {
            socket.emit('discoverable', { itemName: "silver ladle", socketProp: 'hasLadle', discFunction: 'discGet', itemID: "5fd69bff4c88070749b5ba11", user })
        }
    },

    "Cliff's Edge": {
        jumpOff: function jumpOff({ setChatHistory, user, playerPosition, socket, location, actionCalls, command }) {
            let ringIsWorn = false;
            let ringInPockets = false;
            user.inventory.forEach(({ item }) => {
                if (item.itemName === 'dull ring') ringInPockets = true;
            })
            if (user.wornItems.fingerSlot === 'dull ring') ringIsWorn = true;
            setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "You leap off the cliff!" }]);
            setTimeout(() => {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "Gentle mist brushes your face as you fall through the sparse clouds..." }]);
                setTimeout(() => {
                    if (ringIsWorn) {
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "Your life flashes before your eyes and... suddenly you hear a beep and a bright flash blinds you!" }]);
                        setTimeout(() => {
                            processMove(socket, location, user, "move south", playerPosition, setChatHistory, actionCalls, command, true)
                        }, 1500);
                    } else {
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: "Suddenly a strong gust of wind lifts you up and throws you unceremoniously back onto the cliff edge..." }]);
                        if (ringInPockets) {
                            setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "You feel the ring in your pocket grow warm" }]);
                            setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: wear ring" }]);
                        }
                    }
                }, 1000);
            }, 1000);

            console.log('jumping off cliff')
        }
    },

    "Sky Cannon": {
        shootCannon: function shootCannon({ user, setChatHistory, socket, location, playerPosition, actionCalls, command }) {
            let ringIsWorn = false;
            let ringInPockets = false;
            user.inventory.forEach(({ item }) => {
                if (item.itemName === 'dull ring') ringInPockets = true;
            })
            if (user.wornItems.fingerSlot === 'dull ring') ringIsWorn = true;
            setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: "Suddenly the cannon first, launching you high into the air!" }]);
            setTimeout(() => {
                if (ringIsWorn) {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "Your life flashes before your eyes and... suddenly you hear a beep and a bright flash blinds you!" }]);
                    setTimeout(() => {
                        processMove(socket, location, user, "move east", playerPosition, setChatHistory, actionCalls, command, true)
                    }, 1500);
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: "You can barely even let out a scream before you smack back down on the brick path next to the cannon..." }]);
                    if (ringInPockets) {
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat faded", text: "You feel the ring in your pocket grow warm" }]);
                        setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: "Try entering: wear ring" }]);
                    }
                }
            }, 1000);

            console.log('Firing cannon')
        }
    }
}

export default discFunctions;