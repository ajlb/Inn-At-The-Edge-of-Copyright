import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import findIn, { takeTheseOffThat, getOneOfTheseOffThat } from "../../clientUtilities/finders";
import { useEffect } from 'react';
import socket from "../../clientUtilities/socket";
import { getItem, dropItem } from "./js/getDrop";
import { insertArticleSingleValue } from "../../clientUtilities/parsers";
import { giveItem } from './js/give';
import { juggle, stopJuggling } from "./js/juggle";
import { wear, remove } from "./js/wearRemove";
import { showStats } from "./js/stats";
import NPCCheck from "../../clientUtilities/NPCChecks";
import { useAuth0 } from "@auth0/auth0-react";


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
    user,
    setPlayerPosition,
    playerPosition,
    setChatHistory,
    location,
    activities,
    setActivities,
    inConversation,
    setConversation
}) {


    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const authUser = useAuth0().user;

    useEffect(() => {
        isAuthenticated && socket.emit("log in", authUser.email);
        console.log(authUser);
        if (!(authUser === undefined)) {
            (!(authUser.characterName === undefined)) && console.log("authUser: " + authUser.characterName);
        }
    }, [isAuthenticated])
    //update currentMessage in gameinfo based on input bar change
    const onInputBarChange = (e) => {
        setInput(e.target.value)
    }

    //action on enter key
    const handleMessage = (event, type = "displayed-stat") => {
        event.preventDefault();

        setInputHistory(prevState => [...prevState, input])





        //This code is mostly copied over from previous userInteraction.js, and will serve the same purpose here
        if (user.characterName === undefined) {
            if (findIn(input, ["log in", "logon", "login", "log on"])) {
                console.log("log on: " + input);
                loginWithRedirect();
                // let message = takeTheseOffThat(["log in", "logon", "login", "log on"], input);
            } else {
                socket.emit("log in", "You must log in first! Type 'log in [username]'");
            }
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
                console.log('option 1');
                console.log(message);
            } else {
                message = input.split(' ').slice(1).join(' ');
                console.log('option 2');
                console.log(message);
            }

            NPCCheck(location.current.NPCs, message)
                .then(({ NPCName, message }) => {
                    console.log(`To NPC named ${NPCName}: ${message}`)
                    socket.emit('to NPC', { toNPC: NPCName, message })
                })
                .catch(err => {
                    console.log(err.message)
                    // fyi, checking if the message begins with someone's name is handled on the server side
                    socket.emit('whisper', { message, user: user.characterName })
                })
        } else if (findIn(input, actionCalls.inventory)) {
            socket.emit('inventory', input)
        } else if (findIn(input, actionCalls.juggle)) {
            juggle(input, user, location.current.locationName);
        } else if (input.toLowerCase() === "stop juggling") {
            stopJuggling(user.characterName, true);
        } else if (findIn(input, actionCalls.stats)) {
            showStats(user, setChatHistory, actionCalls.stats, input);
        } else if (findIn(input, actionCalls.position)) {
            let command = getOneOfTheseOffThat(actionCalls.position, input);
            if (findIn(command, ['lie', 'lay']) && playerPosition !== 'lying down') {
                setPlayerPosition('lying down');
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `You are now lying down.` }]);
            } else if (findIn(command, ['sit']) && playerPosition !== 'sitting') {
                setPlayerPosition('sitting');
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `You are now sitting.` }]);
            } else if (findIn(command, ['stand']) && playerPosition !== 'standing') {
                setPlayerPosition('standing');
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `You are now standing.` }]);
            } else if (findIn(input, actionCalls.help)) {
                let help = takeTheseOffThat(actionCalls.help, input);
                console.log(help);
                socket.emit('help', input);
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `You are already ${playerPosition}` }]);
            }
        } else if (!inConversation) {
            // Everything in here cannot be run while in a conversation with an NPC
            if (findIn(input, actionCalls.move)) {
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
            } else if (findIn(input, actionCalls.speak)) {
                const message = takeTheseOffThat(actionCalls.speak, input);
                socket.emit('speak', { message, user: user.characterName, location: location.current.locationName });
            } else if (findIn(input, actionCalls.look)) {
                socket.emit('look', input)
            } else if (findIn(input, actionCalls.get)) {
                const target = takeTheseOffThat(actionCalls.get, input);
                getItem(socket, user, target, location);
            } else if (findIn(input, actionCalls.drop)) {
                const target = takeTheseOffThat(actionCalls.drop, input);
                dropItem(socket, location, target, user);
            } else if (findIn(input, actionCalls.wear)) {
                wear(input, user, actionCalls.wear);
            } else if (findIn(input, actionCalls.remove)) {
                remove(input, user, actionCalls.remove);
            } else if (findIn(input, actionCalls.emote)) {
                const emoteThis = takeTheseOffThat(actionCalls.emote, input);
                console.log(emoteThis);
                socket.emit('emote', { user: user.characterName, emotion: emoteThis, location: location.current.locationName });
            } else if (findIn(input, actionCalls.sleep)) {
                if (activities.sleeping) {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You are already sleeping.` }]);
                } else if (playerPosition === "lying down") {
                    setActivities(prevState => { return { ...prevState, sleeping: true } });
                    socket.emit('sleep', { userToSleep: user.characterName, location: location.current.locationName });
                } else {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You need to lie down to do that!` }]);
                }
                // socket.emit('sleep', input)
            } else if (findIn(input, actionCalls.wake)) {
                if (!activities.sleeping) {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You are already awake!` }]);
                } else {
                    setActivities(prevState => { return { ...prevState, sleeping: false } });
                    socket.emit('wake', { userToWake: user.characterName, location: location.current.locationName })
                }
            } else if (findIn(input, actionCalls.give)) {
                let inputString = takeTheseOffThat(actionCalls.give, input);
                let item = inputString.split(" to ")[0];
                let target = takeTheseOffThat([item + " to "], inputString);
                giveItem(socket, item, target, user, location);

            } else if (findIn(input, actionCalls.examine)) {
                const command = getOneOfTheseOffThat(actionCalls.examine, input.toLowerCase());
                let toExamine = takeTheseOffThat(actionCalls.examine, input.toLowerCase());
                toExamine = takeTheseOffThat(['the', 'a', 'an'], toExamine)
                console.log("You are attempting to examine", toExamine)
                console.log(user)
                if (location.current.discoverables && toExamine.trim() !== '') {
                    let discoverables = location.current.discoverables;
                    let description;
                    let exampleCommand;
                    discoverables.forEach(discoverable => {
                        discoverable.names.forEach(name => {
                            if (name.startsWith(toExamine.toLowerCase()) && toExamine.trim() !== '') {
                                console.log("You found the", name);
                                description = discoverable.description;
                                exampleCommand = discoverable.exampleCommand;
                            }
                        })
                    })
                    if (description) {
                        setChatHistory(prevState => {
                            if (exampleCommand) {
                                return [...prevState,
                                { type: 'displayed-stat', text: `You see ${description}` },
                                { type: 'displayed-commands', text: `Try entering: ${exampleCommand}` }]
                            } else {
                                return [...prevState, { type: 'displayed-stat', text: `You see ${description}` }]
                            }
                        })
                    } else {
                        setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
                    }
                } else if (toExamine.trim() === '') {
                    setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: `You didn't enter anything to ${command}! Try entering: ${command} <something>` }] })
                } else {
                    setChatHistory(prevState => { return [...prevState, { type: "displayed-error", text: "There's nothing to discover by that name" }] })
                }

            } else if (findIn(input, ["logout", "log out", "log off"])) {
                takeTheseOffThat(["logout, log out", "log off"], input);
                logout({ returnTo: window.location.origin });
                // socket.emit('logout', location.current.locationName);
            } else {
                setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `Hmmmm... that didn't quite make sense. Try 'help' for a list of commands!` }]);
            }
        } else if (inConversation) {
            NPCCheck(location.current.NPCs, inConversation.with)
                .then(({ NPCName, message }) => {
                    console.log(`To NPC named ${inConversation.with}: ${input}`)
                    socket.emit('to NPC', { toNPC: inConversation.with, message: input })
                })
                .catch(err => {
                    setConversation(false);
                    console.log(err.message);
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `It looks like ${inConversation.with} has left` }]);
                })
        } else {
            setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `Hmmmm... that didn't quite make sense. Try 'help' for a list of commands!` }]);
        }

        setInput('');
    }



    // }
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