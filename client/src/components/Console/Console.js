import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png"
import "./css/styles.css";
import { isBrowser } from 'react-device-detect';
import { getActions } from "../../Utils/API";
import GamewideInfo from '../../Utils/GamewideInfo';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import findIn from "../../pages/js/finders";



function Console() {
    
    //set state for whether to move to min state (because of soft keyboard on mobile)
    const [minState, setMinState] = useState("max");
    //set initial state for GamewideInfo provider - gameInfo.actions
    const initialGameInfo = {
        actions: [],
        chatHistory: [],
        userCommandsHistory: [],
        theme: "",
        currentMessage: ""
    }
    const [gameInfo, setGameInfo] = useState(initialGameInfo);
    const [actionCalls, setActionCalls] = useState({});



    //blur and select functions for input - to set min state
    const onSelect = () => {
        setMinState("min");

    }
    const onBlur = () => {
        setMinState("max")
    }



    //update currentMessage in gameinfo based on input bar change
    const onInputBarChange = (event) => {
        setGameInfo({
            ...gameInfo,
            currentMessage: event.target.value
        })
    }



    //action on enter key
    const handleMessage = (event, type = "displayed-stat") => {
        event.preventDefault();

        //record and clear value from input bar
        const input = document.querySelector("input");
        let value = input.value;
        input.value = "";

        //send messages to chatHistory and commandHistory. chatHistory will later be handled by message listener
        setGameInfo(prevState => ({
            ...gameInfo,
            chatHistory: [...prevState.chatHistory, { type, text: gameInfo.currentMessage }],
            userCommandsHistory: [...prevState.userCommandsHistory, {value}]
        }))

        //This code is mostly copied over from previous userInteraction.js, and will serve the same purpose here
        if (findIn(value, actionCalls.move)) {
          console.log("parseMove(value);")
        } else if (value.toLowerCase() === "stop juggling") {
          console.log("stopJuggling();")
        } else if (findIn(value, actionCalls.inventory)) {
          console.log("parseInventory('Player');")
        } else if (findIn(value, actionCalls.speak)) {
          console.log("speak(value);")
        // } else if (findIn(value, currentLocation.NPCs.split(", "))) {
        //   console.log("talkDirectlyToNPC(value);")
        } else if (findIn(value, actionCalls.help)) {
          console.log("displayHelp(value);")
        } else if (findIn(value, actionCalls.look)) {
          console.log("lookAround(value);")
        // } else if (juggleTime) {//following gameInfo.actions can't be done while juggling
        //   console.log("You should probably stop juggling first.");
        } else if (findIn(value, actionCalls.get)) {
          console.log("getItem(value);")
        } else if (findIn(value, actionCalls.drop)) {
          console.log("dropItem(value);")
        } else if (findIn(value, actionCalls.wear)) {
          console.log("wearItem(value);")
        } else if (findIn(value, actionCalls.remove)) {
          console.log("removeItem(value);")
        } else if (findIn(value, actionCalls.emote)) {
          console.log("emote(value);")
        } else if (findIn(value, actionCalls.juggle)) {
          console.log("juggle(value);")
        } else if (findIn(value, actionCalls.stats)) {
          // parseStats();
        } else if (findIn(value, actionCalls.sleep)) {
          console.log("sleep();")
        } else if (findIn(value, actionCalls.wake)) {
          console.log("wake();")
        } else if (findIn(value, actionCalls.position)) {
          console.log("sitStandLie(value);")
        } else if (findIn(value, actionCalls.give)) {
          console.log("giveItem(value);")
        } else if (findIn(value, actionCalls.examine)) {
          console.log("examine(value);")
        } else {
          console.log("hmmm... that didn't quite make sense. Try 'help' for a list of commands!");
        }
      
        










    }


    
    //initialize console with black background, minState="max", and then fetch data for GamewideData
    useEffect(() => {
        let mounted = true;
        document.body.style.backgroundColor = 'black'
        if (isBrowser) {
            setMinState("max");
        }
        getActions().then(actionData => {
            if (mounted) {
                //init gameInfo with chatHistory of Hello and action data
                setGameInfo({
                    ...gameInfo,
                    chatHistory: [{ type: "displayed-stat", text: "Hello" }],
                    actions: actionData.data
                });
                //create an object full of ways to call actions
                let deconstructedActions = {};
                for (const action of actionData.data){
                    deconstructedActions[action.actionName] = action.waysToCall.split(", ")
                }
                //set previously create object as actionCalls (in state)
                setActionCalls(deconstructedActions);

            }
        });

        //avoid trying to set state after component is unmounted
        return function cleanup() {
            mounted = false;
        }
    }, [])



    return (
        <div>
            <div className="wrapper">
                <ErrorBoundary>
                    <GamewideInfo.Provider value={gameInfo}>
                        {(minState === "max") &&
                            <figure>
                                <img src={logo} alt="Inn At The Edge of Copyright Logo" id="logo" />
                            </figure>
                        }
                        <div id="panel-border" style={{
                            height: minState === "min" && 50 + "vh",
                            width: minState === "min" && 120 + "vw",
                            marginTop: minState === "min" && 57 + "vh",
                            overflow: minState === "min" && "hidden"
                        }}>
                            <div className="panel-default" style={{
                                height: minState === "min" && 100 + "%",
                                width: minState === "min" && 100 + "%"
                            }}>
                                <div id="panel-interior">
                                    <div className="panel-heading"></div>
                                    <div id="location-info"></div>
                                    <ChatPanel />
                                    <InputPanel
                                        onBlur={onBlur}
                                        onSelect={onSelect}
                                        minState={minState}
                                        onSubmit={handleMessage}
                                        onChange={onInputBarChange} />
                                </div>
                            </div>
                        </div>
                    </GamewideInfo.Provider>
                </ErrorBoundary>
            </div>
            {(minState === "max") &&
                <div className="push"></div>
            }
            {(minState === "max") &&
                <footer id="about-link"><a style={{ color: "white" }} href="/about">Meet our team!</a></footer>
            }
        </div>
    );
}

export default Console;