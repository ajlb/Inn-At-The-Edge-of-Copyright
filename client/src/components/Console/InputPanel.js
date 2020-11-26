import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import findIn, {takeTheseOffThat} from "../../clientUtilities/finders";
import socket from "../../clientUtilities/socket";
import {getItem, dropItem} from "./js/getDrop";
import {insertArticleSingleValue} from "../../clientUtilities/parsers";

//set up index for current position in userCommandsHistory
let inputHistoryIndex;
//constant variables for parsing
const DIRECTIONS = { n: "north", e: "east", s: "south", w: "west" };


function InputPanel({
    // Props being handed to the input by the console component
    onBlur,
    onSelect,
    minState,
    input,
    setInput,
    inputHistory,
    setInputHistory,
    actionCalls,
    location,
    user
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
        if (user.characterName===undefined){
            if (findIn(input, ["log in", "logon", "login", "log on"])) {
                console.log("log on: " + input);
                let message = takeTheseOffThat(["log in", "logon", "login", "log on"], input);
                console.log(message);
                socket.emit("log in", message);
            } else {
                socket.emit("log in", "You must log in first! Type 'log in [username]'");
            }
        } else if (findIn(input, actionCalls.move)) {
            let direction = takeTheseOffThat(actionCalls.move, input);
            for (const param in DIRECTIONS) {
                if (direction.toLowerCase() === param) {
                    direction = DIRECTIONS[param];
                }
            }
            let moved = false;
            for (const param in location){
                if (param === direction){
                    socket.emit('move', {previousLocation: location.current.locationName, newLocation: location[param].locationName, direction, user:user.characterName});
                    moved = true;
                } 
            }
            if (moved === false){
                socket.emit('failure', `There is no exit ${direction}`);
            }
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
            const message = takeTheseOffThat(actionCalls.speak, input);
            socket.emit('speak', {message, user:user.characterName, location: location.current.locationName});
        } else if (findIn(input, actionCalls.help)) {
            socket.emit('help', input)
        } else if (findIn(input, actionCalls.look)) {
            socket.emit('look', input)
        } else if (findIn(input, actionCalls.get)) {
            const target = takeTheseOffThat(actionCalls.get, input);
            const result = getItem(target, location);
            if (result === true){
                socket.emit('get', {target, user: user.characterName, location: location.current.locationName});
            } else if (result === false) {
                socket.emit('green', `There doesn't seem to ${insertArticleSingleValue(target)} to get here.`);
            } else if (typeof result === "string"){
                socket.emit('get', {target: result, user: user.characterName, location: location.current.locationName});
            } else if (typeof result === "object"){
                socket.emit('green', `I'm not sure which you want to get. I think you might mean one of these - ${result.join(", ")}.`);
            }
        } else if (findIn(input, actionCalls.drop)) {
            const target = takeTheseOffThat(actionCalls.drop, input);
            const result = dropItem(target, user);
            if (result === true){
                socket.emit('drop', {target, user: user.characterName, location: location.current.locationName});
            } else if (result === false){
                socket.emit('green', `You don't seem to have ${insertArticleSingleValue(target)} to drop.`);
            } else if (typeof result === "string"){
                socket.emit('drop', {target: result, user: user.characterName, location: location.current.locationName});
            } else if (typeof result === "object"){
                socket.emit('green', `I'm not sure which you want to drop. I think you might mean one of these - ${result.join(", ")}.`);
            }
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
        } else if (findIn(input, ["logout", "log out", "log off"])) {
            takeTheseOffThat(["logout, log out", "log off"], input);
            socket.emit('logout', input);
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