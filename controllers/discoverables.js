const functions = {
    mousehole: function () {
        setTimeout(() => {
            processMove(socket, location, user, "move west", playerPosition, setChatHistory, actionCalls);
        }, 1000)
    }
}

module.exports = { functions }