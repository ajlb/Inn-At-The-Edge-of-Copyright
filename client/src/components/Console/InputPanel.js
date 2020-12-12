import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import findIn, { takeTheseOffThat, getOneOfTheseOffThat } from "../../clientUtilities/finders";
import { useEffect } from 'react';
import socket from "../../clientUtilities/socket";
import { getItem, dropItem } from "./js/getDrop";
import { giveItem } from './js/give';
import { juggle, stopJuggling } from "./js/juggle";
import { startShoutTimer } from "./js/timers";
import { wear, remove } from "./js/wearRemove";
import { showStats } from "./js/stats";
import { showInventory } from "./js/inventory";
import NPCCheck from "../../clientUtilities/NPCChecks";
import { useAuth0 } from "@auth0/auth0-react";
// import DiscoverableCalls from "../../clientUtilities/discoverablesCalls";
// import DiscoverableFunctions from "../../clientUtilities/discoverablesFunctions";
import { lookAbout } from './js/look';
import { attackCreature } from "./js/monsters";
import processMove from './js/move';
import runExamine from './js/examine';

//set up index for current position in userCommandsHistory
let inputHistoryIndex;
//constant variables for parsing

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
    setConversation,
    muted,
    setMuted,
    canReply
}) {

    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const authUser = useAuth0().user;

    useEffect(() => {
        isAuthenticated && socket.emit("log in", authUser.email);
        if (!(authUser === undefined)) {
            (!(authUser.characterName === undefined)) && console.log("authUser: " + authUser.characterName);
        }
    }, [isAuthenticated])
    //update currentMessage in gameinfo based on input bar change
    const onInputBarChange = (e) => {
        setInput(e.target.value)
    }

    // console.log(user);

    socket.off('YouCanLogIn').on('YouCanLogIn', () => {
        socket.emit("log in", authUser.email);
    })

    //action on enter key
    const handleMessage = (event) => {
        event.preventDefault();

        setInputHistory(prevState => [...prevState, input])

        let discoverableCommands = [];
        if (location.current.discoverables) {
            location.current.discoverables.forEach(discObj => {
                if (discObj.commands) {
                    discObj.commands.forEach(command => discoverableCommands.push(command))
                }
            })
        }

        ////////////////////////////////
        //                            //
        //        USER ACTIONS        //
        //                            //
        //    permissable in convo    //
        ////////////////////////////////

        /////////////////////
        //  PROMPT LOG IN  //
        /////////////////////
        if (user.characterName === undefined) {
            if (findIn(input, ["log in", "logon", "login", "log on"])) {
                loginWithRedirect();
                // let message = takeTheseOffThat(["log in", "logon", "login", "log on"], input);
            } else {
                socket.emit("log in", "You must log in first! Type 'log in [username]'");
            }
            /////////////////////
            //    NEW USER     //
            /////////////////////
        } else if (user.characterName === "newUser") {
            console.log('Emit newUser')
            socket.emit('newUser', { input, email: authUser.email });
            /////////////////////
            //      REPLY      //
            /////////////////////
        } else if (findIn(input, discoverableCommands)) {
            const command = getOneOfTheseOffThat(discoverableCommands, input)
            const foundDiscoverable = location.current.discoverables.find(discObj => {
                return discObj.commands.includes(command)
            })
            if (foundDiscoverable.actionDescription) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: foundDiscoverable.actionDescription }]);
            }
            if (foundDiscoverable.action) {
                console.log('Has action');
                // socket.emit('discoverable', foundDiscoverable.action)
            }
        } else if (findIn(input, actionCalls.reply)) {
            if (canReply) {
                let message = canReply.to + ' ' + takeTheseOffThat(actionCalls.reply, input)
                socket.emit('whisper', { message, userData: user })
            } else {
                setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: "You have nobody to reply to!" }]);
            }
            /////////////////////
            //    WHISPER      //
            /////////////////////
        } else if (findIn(input, actionCalls.whisper)) {
            let message = takeTheseOffThat(actionCalls.whisper, input);

            NPCCheck(location.current.NPCs, message)
                .then(({ NPCName, message }) => {
                    socket.emit('to NPC', { toNPC: NPCName, message })
                })
                .catch(() => {
                    // This runs if the entered character is not an NPC
                    // fyi, checking if the message begins with someone's name is handled on the server side
                    socket.emit('whisper', { message, userData: user })
                })
            /////////////////////
            //    INVENTORY    //
            /////////////////////
        } else if (findIn(input, actionCalls.inventory)) {
            // let inventory = takeTheseOffThat(actionCalls.inventory, input)
            showInventory(user, setChatHistory);
            /////////////////////
            //     JUGGLE      //
            /////////////////////
        } else if (findIn(input, actionCalls.juggle)) {
            juggle(input, user, location.current.locationName);
        } else if (input.toLowerCase() === "stop juggling") {
            stopJuggling(user.characterName, true);
            /////////////////////
            //      STATS      //
            /////////////////////
        } else if (findIn(input, actionCalls.stats)) {
            showStats(user, setChatHistory, actionCalls.stats, input);
            /////////////////////
            //      HELP       //
            /////////////////////
        } else if (findIn(input, actionCalls.help)) {
            let help = takeTheseOffThat(actionCalls.help, input);
            socket.emit('help', { message: help });
            /////////////////////
            //    POSITION     //
            /////////////////////
        } else if (findIn(input, actionCalls.position)) {
            console.log("Position invoked")
            console.log("activities.sleeping:", activities.sleeping)
            console.log("position", playerPosition)
            if (!activities.sleeping) {
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
                } else {
                    setChatHistory(prevState => [...prevState, { type: "displayed-green", text: `You are already ${playerPosition}` }]);
                }
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `You need to be awake to do that` }]);
            }



            ////////////////////////////////
            //                            //
            //   OUT OF CONVO ACTIONS     //
            //                            //
            ////////////////////////////////



        } else if (!inConversation) {
            // Everything in here cannot be run while in a conversation with an NPC
            // if (findIn(input, DiscoverableCalls.get(location.current.locationName))) {
            //     console.log('something discoverable is happening');
            // } else 
            if (findIn(input, actionCalls.move)) {
                processMove(socket, location, user, input, playerPosition, setChatHistory, actionCalls);
            } else if (findIn(input, actionCalls.speak)) {
                const message = takeTheseOffThat(actionCalls.speak, input);
                socket.emit('speak', { message, user: user.characterName, location: location.current.locationName });
            } else if (findIn(input, actionCalls.shout)) {
                const command = getOneOfTheseOffThat(actionCalls.shout, input.toLowerCase());
                if (!muted) {
                    const message = takeTheseOffThat(actionCalls.shout, input)
                    if (message.trim() !== "") {
                        startShoutTimer(setMuted)
                        socket.emit('shout', { location: user.lastLocation, fromUser: user.characterName, message })
                    } else {
                        setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `Looks like you didn't ${command} anything! Try ${command} [your message here]` }]);
                    }
                } else {
                    if (muted.secondsLeft !== undefined) {
                        setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `You cannot ${command} for ${muted.secondsLeft} more seconds` }]);
                    } else {
                        setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `You cannot ${command} for 10 more seconds` }]);
                    }
                }
                // console.log(user)
            } else if (findIn(input, actionCalls.look)) {
                lookAbout(location, setChatHistory);
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
                let command = getOneOfTheseOffThat(actionCalls.emote, input)
                const emoteThis = takeTheseOffThat(actionCalls.emote, input);
                if (emoteThis.trim() !== '') {
                    socket.emit('emote', { user: user.characterName, emotion: emoteThis, location: location.current.locationName });
                } else {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `Looks like you didn't emote anything! Try ${command} runs around wildly` }]);
                }
            } else if (findIn(input, actionCalls.sleep)) {
                if (activities.sleeping) {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You are already sleeping.` }]);
                } else if (playerPosition === "lying down") {
                    socket.emit('sleep', { userToSleep: user.characterName, location: location.current.locationName });
                } else {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You need to lie down to do that!` }]);
                }
                // socket.emit('sleep', input)
            } else if (findIn(input, actionCalls.wake)) {
                if (!activities.sleeping) {
                    setChatHistory(prevState => [...prevState, { type: 'displayed-error', text: `You are already awake!` }]);
                } else {
                    socket.emit('wake', { userToWake: user.characterName, location: location.current.locationName })
                }
            } else if (findIn(input, actionCalls.give)) {
                let inputString = takeTheseOffThat(actionCalls.give, input);
                let item = inputString.split(" to ")[0];
                let target = takeTheseOffThat([item + " to "], inputString);
                giveItem(socket, item, target, user, location);

            } else if (findIn(input, actionCalls.examine)) {
                let toExamine = takeTheseOffThat(actionCalls.examine, input.toLowerCase());
                const command = getOneOfTheseOffThat(actionCalls.examine, input.toLowerCase());
                toExamine = takeTheseOffThat(['the', 'a', 'an'], toExamine)
                runExamine({ input, location, command, toExamine, user, setChatHistory });

            } else if (findIn(input, actionCalls.attack)) {
                let target = takeTheseOffThat(actionCalls.attack, input).toLowerCase();
                target = takeTheseOffThat(["the, a, an, that"], target);
                attackCreature(socket, user, location, target);
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