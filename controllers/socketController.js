// this array is fully temporary and is only here in place of the database until that is set up
let players = ['the mando', 'shambles', 'cosmo the magnificent'];

module.exports = function (io) {
    // this runs only when the user initially connects
    // if the user refreshes their browser, it will disconnect and reconnect them
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected!`);
        // possibly do a DB call to state that the use is online?

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected...`);
            // possibly do a DB call to state that the use is offline?
        })

        socket.on('move', ({ message, username }) => {
            // get users current location
            // get northern route from users location
            // get the location of the route
            // send that returned location back to the user
        });

        socket.on('whisper', message => {
            let playerTo

            // How this works:
            //   This for loop is going to see if the message received from the user starts with a player name
            //   Because player names are only allowed to be three words max(two spaces),
            //   this for loop iterates through the first three words of the users message starting at 3 and working its way down
            // if at any point in the loop it recognizes a player's name, it will set the playerTo variable to that player's name
            for (let i = 2; i >= 0; i--) {
                const messageString = message.toLowerCase().split(' ').slice(0, i + 1).join(' ');
                players.forEach(player => {
                    if (player === messageString) {
                        playerTo = messageString;
                        message = message.split(' ').slice(i + 1).join(' ');
                    }
                })
            }
            if (playerTo === undefined) {
                io.emit('error', { status: 404, message: "There is nobody by that name" })
            } else {
                console.log(playerTo)
                console.log(message)
                io.emit('message', { message, userTo: playerTo })
            }
        })
    })

}