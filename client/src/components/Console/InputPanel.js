import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import findIn from "../../clientUtilities/finders";
import socket from "../../clientUtilities/socket";

//set up index for current position in userCommandsHistory
let inputHistoryIndex;

function InputPanel({
    // Props being handed to the input by the console component
    onBlur,
    onSelect,
    minState,
    input,
    setInput,
    inputHistory,
    setInputHistory,
    actionCalls
}) {

    //update currentMessage in gameinfo based on input bar change
    const onInputBarChange = (e) => {
        setInput(e.target.value)
    }

    //action on enter key
    const handleMessage = (event, type = "displayed-stat") => {
        event.preventDefault();

        setInputHistory(prevState => [...prevState, input])

        //This code is mostly copied over from previous userInteraction.js, and will serve the same purpose here
        if (findIn(input, actionCalls.move)) {
            let message = input.split(' ').splice(1).join(' ');
            socket.emit('move', message)
        } else if (input.toLowerCase() === "stop juggling") {
            socket.emit('stop juggle', input)
        } else if (findIn(input, actionCalls.inventory)) {
            socket.emit('inventory', input)
        } else if (findIn(input, actionCalls.whisper)) {
            let message;
            // If it starts with one of these two-word commands, it will remove the first two words from the message, if not, it will just remove the first word
            // ie: 
            //   whisper to Nick Hello there! 
            // becomes
            //   Nick Hello there!
            // and
            //   /w Shambles General Kenobi...
            // becomes
            //   Shambles General Kenobi...
            if (findIn(input, ['whisper to', 'speak to', 'tell to', 'say to', 'talk to'])) {
                message = input.split(' ').slice(2).join(' ');
            } else {
                message = input.split(' ').slice(1).join(' ');
            }
            // fyi, checking if the message begins with someone's name is handled on the server side
            socket.emit('whisper', message)
        } else if (findIn(input, actionCalls.speak)) {
            socket.emit('speak', input)
        } else if (findIn(input, actionCalls.help)) {
            socket.emit('help', input)
        } else if (findIn(input, actionCalls.look)) {
            socket.emit('look', input)
        } else if (findIn(input, actionCalls.get)) {
            socket.emit('get', input)
        } else if (findIn(input, actionCalls.drop)) {
            socket.emit('drop', input)
        } else if (findIn(input, actionCalls.wear)) {
            socket.emit('wear', input)
        } else if (findIn(input, actionCalls.remove)) {
            socket.emit('remove', input)
        } else if (findIn(input, actionCalls.emote)) {
            socket.emit('emote', input)
        } else if (findIn(input, actionCalls.juggle)) {
            socket.emit('juggle', input)
        } else if (findIn(input, actionCalls.stats)) {
            socket.emit('stats', input)
        } else if (findIn(input, actionCalls.sleep)) {
            socket.emit('sleep', input)
        } else if (findIn(input, actionCalls.wake)) {
            socket.emit('wake', input)
        } else if (findIn(input, actionCalls.position)) {
            socket.emit('position', input)
        } else if (findIn(input, actionCalls.give)) {
            socket.emit('give', input)
        } else if (findIn(input, actionCalls.examine)) {
            socket.emit('examine', input)
        } else {
            console.log("hmmm... that didn't quite make sense. Try 'help' for a list of commands!");
        }
        setInput('');
    }

    //display previous commands on key up, key down
    const keyDownResults = (event) => {

        // only runs if the user has an inputHistory
        if (inputHistory.length > 0) {
            if (event.which === 38) { // up arrow

                //prevents the inputHistoryIndex getting any lower than zero
                inputHistoryIndex > 0 ? inputHistoryIndex -= 1 : inputHistoryIndex = 0;
                setInput(inputHistory[inputHistoryIndex]);

            } else if (event.which === 40) { // down arrow

                //stop at inputHistory length
                inputHistoryIndex < inputHistory.length ? inputHistoryIndex += 1 : inputHistoryIndex = inputHistory.length;
                //if inputHistoryIndex is less than length, show indexed message, otherwise show ""
                inputHistoryIndex < inputHistory.length ? setInput(inputHistory[inputHistoryIndex]) : setInput('');

            } else if (event.which === 13) { // enter key
                //reset inputHistoryIndex to end
                inputHistoryIndex = inputHistory.length + 1;
            }
        }
    }

    return (
        <div>
            <BrowserView>
                <div className="input-box">
                    <form
                        onSubmit={handleMessage}
                    >
                        <div id="input-group">
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
                                value={input}
                                onChange={onInputBarChange}
                                type="text"
                                id="inputBar"
                                className="form-control chat-input" autoFocus="autofocus"
                                autoComplete="off"
                                onKeyDown={keyDownResults}
                            />
                            <span className="input-group-btn">
                                <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                            </span>
                        </div>
                    </form>
                </div>
            </BrowserView>
            <MobileView>
                <div className="input-box">
                    <form
                        onSubmit={handleMessage}
                    >
                        <div
                            id="input-group"
                            style={{
                                width: minState === "min" && 100 + "%"
                            }}
                        >
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
                                onChange={onInputBarChange}
                                type="text"
                                id="inputBar"
                                className="form-control chat-input"
                                onBlur={onBlur}
                                onSelect={onSelect}
                                autoComplete="off"
                                value={input}
                            />
                            <span className="input-group-btn">
                                <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                            </span>
                        </div>
                    </form>
                </div>
            </MobileView>
        </div>
    )
}

export default InputPanel;