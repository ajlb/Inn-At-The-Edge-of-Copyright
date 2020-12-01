import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png";
import { isBrowser } from 'react-device-detect';
import GamewideInfo from '../../clientUtilities/GamewideInfo';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import socket from "../../clientUtilities/socket";
import "./css/styles.css";


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
  const [location, setLocation] = useState({});
  const [player, setPlayer] = useState({});




  // Socket log in message
  socket.off('log in').on('log in', message => {
    console.log("got a log in message from socket");
    let type = 'displayed-stat';
    setPlayer({
      ...player,
      characterName: message
    })
    setChatHistory(prevState => [...prevState, { type, text: `Welcome, ${message}! You are now logged in.` }]);
  });

  // Socket failed log in message
  socket.off('logFail').on('logFail', message => {
    console.log("got a log in failure message from socket");
    let type = 'displayed-error';
    setChatHistory(prevState => [...prevState, { type, text: `${message}` }]);
  });

  // Socket log out message
  socket.off('logout').on('logout', message => {
    let type = 'displayed-stat';
    setChatHistory(prevState => [...prevState, { type, text: message }]);
    setPlayer({});
    setLocation({});
  });

  // Socket initial userData
  socket.off('playerData').on('playerData', message => {
    console.log("recieved Player Data");
    console.log(message);
    if (!(message === null)) {
      setPlayer(message);
    }
  });

  //Socket updated userData
  socket.off('playerUpdate').on('playerUpdate', updatedPlayerData => {
    if (!(updatedPlayerData === null)) {
      setPlayer(updatedPlayerData);
    }
  });

  // Socket player inventory update
  socket.off('invUpP').on('invUpP', message => {
    if (!(message === null)) {
      setPlayer({
        ...player,
        inventory: message
      });
    }
  });

  // Socket location inventory update
  socket.off('invUpL').on('invUpL', message => {
    if (!(message === null)) {
      setLocation({
        ...location,
        current: {
          ...location.current,
          inventory: message
        }
      });
    }
  });

  const [gameInfo, setGameInfo] = useState(initialGameInfo);

  const [day, setDay] = useState(true);

  const [activities, setActivities] = useState({
    sleeping: false,
    juggling: false,
    fighting: false,
    singing: false
  })

  const [chatHistory, setChatHistory] = useState([]);

  const [input, setInput] = useState('');

  const [inputHistory, setInputHistory] = useState([]);

  const [playerPosition, setPlayerPosition] = useState('standing');

  const [actionCalls, setActionCalls] = useState({
    move: ['move', '/m', 'walk', 'exit'],
    inventory: ['inventory', '/i'],
    speak: ['speak', 'say', '/s'],
    look: ['look', '/l'],
    help: ['help', '/h'],
    get: ['get', '/g', 'pick up'],
    drop: ['drop', 'discard', '/d'],
    wear: ['wear', 'put on'],
    remove: ['remove', '/r', 'take off'],
    emote: ['emote', '/e'],
    juggle: ['juggle'],
    stats: ['stats'],
    sleep: ['go to sleep', 'sleep', 'fall asleep'],
    wake: ['wake', 'wake up', 'awaken'],
    position: ['lay down', 'lie down', 'stand up', 'sit down', 'sit up', 'sit', 'stand', 'lay', 'lie'],
    give: ['give'],
    examine: ['examine'],
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
                    activities={activities}
                    setActivities={setActivities}
                    user={player}
                    location={location}
                    setLocation={setLocation}
                    day={day}
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
                    setChatHistory={setChatHistory}
                    playerPosition={playerPosition}
                    setPlayerPosition={setPlayerPosition}
                    location={location}
                    user={player}
                    activities={activities}
                    setActivities={setActivities}
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