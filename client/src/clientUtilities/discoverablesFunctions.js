import processMove from '../components/Console/js/move';

/* ---------Global Variables----------*/
let startDoorisLocked = true;
let hasStartKey = false;
let wardrobeIsOpen = false;
let wardrobeList = [];
let playerStartRoomInventory = [];


const discFunctions = {
    "Inn Laundry Room": {
        /*****************************/
        /*      Inn Laundry Room     */
        /*****************************/

        mousehole: function mousehole({ socket, location, user, playerPosition, setChatHistory, actionCalls }) {
            setTimeout(() => {
                processMove(socket, location, user, "move west", playerPosition, setChatHistory, actionCalls)
            }, 1000)
        },

        pullBook: function pullBook({ socket, location, user, playerPosition, setChatHistory, actionCalls }) {
            setTimeout(() => {
                processMove(socket, location, user, "move south", playerPosition, setChatHistory, actionCalls)
            }, 1000)
        }

    },
    "Start Room": {
        /*****************************/
        /*         Start Room        */
        /*****************************/

        unlockDoor: function unlockDoor({ setChatHistory }) {
            setTimeout(() => {
                if (hasStartKey) {
                    startDoorisLocked = false;
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: "The silver latch unlocks and falls to the floor! Though the door swings open, it seems like you broke your key in the lock..." }]);
                    setChatHistory(prevState => [...prevState, { type: "displayed-commands", text: "Try entering: move east" }]);
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "It seems the door needs a special key to unlock" }]);
                }
            }, 500)
        },

        openWardrobe: function openWardrobe({ setChatHistory }) {
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
        },

        look: function look({ setChatHistory, location }) {
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
                setChatHistory(prevState => [...prevState, { type: "displayed-commands faded", text: `In the wardrobe you see ${inWardrobe}` }]);
            }
        },

        get: function get({ setChatHistory, input }) {
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
                        setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-2", text: "Hiding underneath the pair of brown pants you see a shiny key" }]);
                        wardrobeList.push('a shiny key');
                    }
                    if (isInWardrobeList === 'a shiny key') {
                        hasStartKey = true;
                    }
                    playerStartRoomInventory.push(isInWardrobeList)
                }
            }
            if (!isInWardrobeList) {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: "There's nothing here by that name" }]);
            }
        },

        inventory: function inventory({ setChatHistory }) {
            setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-4 mb-2", text: "You are carrying:" }]);

            playerStartRoomInventory.forEach(item => {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: item }]);
            })
        },

        moveEast: function moveEast({ socket, input, location, user, playerPosition, setChatHistory, actionCalls }) {
            setTimeout(() => {
                if (startDoorisLocked) {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat text-red", text: "Looks like the door is locked! If only you had a  key..." }]);
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-stat mt-3", text: "You step through the wooden doorframe, the floorboards creaking beneath your feet. The door suddenly slams behind you!" }]);
                    processMove(socket, location, user, "move east", playerPosition, setChatHistory, actionCalls)
                }
            }, 500)
        }


    }
}

export default discFunctions;