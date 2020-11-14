import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png"
import "./css/styles.css";
import { isBrowser } from 'react-device-detect';
import { getActions } from "../../Utils/API";
import GamewideInfo from '../../Utils/GamewideInfo';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function Console() {

    //set state for whether to move to min state (because of soft keyboard on mobile)
    const [minState, setMinState] = useState("max");
    //set state for GamewideInfo provider - actions

    const initialGameInfo = {
        actions: [],
        chatHistory: [],
        theme: "",
        currentMessage: ""
    }

    const [gameInfo, setGameInfo] = useState(initialGameInfo);

    //blur and select functions for input - to set min state
    const onSelect = () => {
        setMinState("min");

    }
    const onBlur = () => {
        setMinState("max")
    }

    const handleMessage = (event, type="displayed-stat") => {
        event.preventDefault();
        const input = document.querySelector("input");
        input.value = "";
        setGameInfo(prevState => ({
            ...gameInfo,
            chatHistory: [...prevState.chatHistory, {type, text: gameInfo.currentMessage}]
        }))
    }

    const onInputBarChange = (event) => {
        setGameInfo({
            ...gameInfo,
            currentMessage: event.target.value
        })
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
                console.log("inside console useEffect");
                console.log(actionData);
                setGameInfo({
                    ...gameInfo,
                    chatHistory: [{type:"displayed-stat", text:"Hello"}],
                    actions: actionData.data
                });
            }
        });

        return function cleanup(){
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
                                        onChange={onInputBarChange}/>
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