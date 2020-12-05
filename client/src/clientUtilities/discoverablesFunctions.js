/*****************************/
/*        START ROOM         */
/*****************************/

function closeWardrobe(socket, input){
    socket.emit('closeWardrobe', input);
}

function adjustDoor(socket, input){
    socket.emit('adjustDoor', input);
}

function lookInMirror(socket, input){
    socket.emit('lookInMirror', input);
}



export {
    closeWardrobe,
    adjustDoor,
    lookInMirror
}