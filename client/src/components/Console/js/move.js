import { takeTheseOffThat } from "../../../clientUtilities/finders";

const DIRECTIONS = { n: "north", e: "east", s: "south", w: "west" };


function processMove(socket, location, user, input, playerPosition, setChatHistory, actionCalls){
    if (playerPosition === "standing") {
        let direction = takeTheseOffThat(actionCalls.move, input);
        for (const param in DIRECTIONS) {
            if (direction.toLowerCase() === param) {
                direction = DIRECTIONS[param];
            }
        }
        let moved = false;
        for (const param in location) {
            if (param === direction) {
                socket.emit('move', { previousLocation: location.current.locationName, newLocation: location[param].locationName, direction, user: user.characterName });
                moved = true;
            }
        }
        if (moved === false) {
            socket.emit('failure', `There is no exit ${direction}`);
        }
    } else {
        setChatHistory(prevState => [...prevState, { type: "displayed-error", text: 'You have to stand up to do that!' }]);
    
    }

}



export default processMove;