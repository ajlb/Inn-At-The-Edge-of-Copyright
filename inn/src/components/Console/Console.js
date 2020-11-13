import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png"
import "./css/styles.css";
import { isBrowser } from 'react-device-detect';
import getActions from "../../Utils/API";
import GamewideInfo from '../../Utils/GamewideInfo';

function Console() {



    const [minState, setMinState] = useState("max");
    const [actions, setActions] = useState([]);

    const onSelect = () => {
        setMinState("min");

    }

    const onBlur = () => {
        setMinState("max")
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'black'
        if (isBrowser) {
            setMinState("max");
        }
        getActions().then(actionData => {
            console.log("inside console useEffect");
            console.log(actionData);
            setActions(actionData.data);
        });
    }, [])


    return (
        <div>
            <div className="wrapper">
                <GamewideInfo.Provider value={actions}>
                    {(minState === "max") &&
                        <figure>
                            <img src={logo} alt="Inn At The Edge of Copyright Logo" id="logo" />
                        </figure>
                    }

                    {(minState === "max") ?
                        <div id="panel-border">
                            <div className="panel-default">
                                <div id="panel-interior">
                                    <div className="panel-heading"></div>
                                    <div id="location-info"></div>
                                    <ChatPanel />
                                    <InputPanel
                                        onBlur={onBlur}
                                        onSelect={onSelect}
                                        minState={minState} />
                                </div>
                            </div>
                        </div>
                        :
                        <div id="panel-border" style={{ height: 50 + "vh", width: 120 + "vw", marginTop: 57 + "vh", overflow: "hidden" }}>
                            <div className="panel-default" style={{ height: 100 + "%", width: 100 + "%" }}>
                                <div id="panel-interior">
                                    <div className="panel-heading"></div>
                                    <div id="location-info"></div>
                                    <ChatPanel />
                                    <InputPanel
                                        onBlur={onBlur}
                                        onSelect={onSelect}
                                        minState={minState} />
                                </div>
                            </div>
                        </div>
                    }


                </GamewideInfo.Provider>
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
