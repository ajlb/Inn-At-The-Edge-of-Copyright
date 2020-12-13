import processMove from '../components/Console/js/move';

/*****************************/
/*      Inn Laundry Room     */
/*****************************/

function mousehole({ socket, location, user, playerPosition, setChatHistory, actionCalls }) {
    setTimeout(() => {
        processMove(socket, location, user, "move west", playerPosition, setChatHistory, actionCalls)
    }, 1000)
}

function pullBook({ socket, location, user, playerPosition, setChatHistory, actionCalls }) {
    setTimeout(() => {
        processMove(socket, location, user, "move south", playerPosition, setChatHistory, actionCalls)
    }, 1000)
}

export default {
    mousehole,
    pullBook
}