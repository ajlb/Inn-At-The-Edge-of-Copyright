import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png";
import { isBrowser } from 'react-device-detect';
import GamewideInfo from '../../clientUtilities/GamewideInfo';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import socket from "../../clientUtilities/socket";
import "./css/styles.css";

let user;
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


  // Socket log in message
  socket.off('log in').on('log in', message => {
    console.log("got a log in message from socket");
    let type = 'displayed-stat';
    user = message;
    setChatHistory(prevState => [...prevState, { type, text: `Welcome, ${message}! You are now logged in.` }]);
    // chat history is mapped down below
  });

  // Socket failed log in message
  socket.off('logFail').on('logFail', message => {
    console.log("got a log in failure message from socket");
    let type = 'displayed-error';
    setChatHistory(prevState => [...prevState, { type, text: `${message}` }]);
    // chat history is mapped down below
  });

  const [gameInfo, setGameInfo] = useState(initialGameInfo);

  const [chatHistory, setChatHistory] = useState([]);

  const [input, setInput] = useState('');

  const [inputHistory, setInputHistory] = useState([]);

  const [actionCalls, setActionCalls] = useState({
    move: ['move', '/m'],
    inventory: ['inventory', '/i'],
    speak: ['speak', 'say', '/s'],
    look: ['look', '/l'],
    help: ['help', '/h'],
    get: ['get', '/g'],
    drop: ['drop', '/d'],
    wear: ['wear'],
    remove: ['remove', '/r'],
    emote: ['emote', '/e'],
    juggle: ['juggle'],
    stats: ['stats'],
    sleep: ['sleep'],
    wake: ['wake'],
    position: ['position'],
    give: ['give'],
    examine: ['examine', '/e'],
    whisper: ['whisper', '/w', 'whisper to', 'speak to', 'say to', 'tell', 'talk to'],
  });

  //blur and select functions for input - to set min state
  const onSelect = () => {
    setMinState("min");
  }
  const onBlur = () => {
    setMinState("max")
  }

  //initialize console with black background, minState="max", and then fetch data for GamewideData
  useEffect(() => {
    let mounted = true;
    document.body.style.backgroundColor = 'black'
    if (isBrowser) {
      setMinState("max");
    }

    // sets a default chat history because chat history needs to be iterable to be mapped
    setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: 'Welcome to the Inn!' }])

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
                  <ChatPanel
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                    user={user}
                  />
                  <InputPanel
                    actionCalls={actionCalls}
                    onBlur={onBlur}
                    onSelect={onSelect}
                    minState={minState}
                    input={input}
                    setInput={setInput}
                    inputHistory={inputHistory}
                    setInputHistory={setInputHistory}
                    user={user}
                  />
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