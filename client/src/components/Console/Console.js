import React, { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png";
import { isBrowser } from 'react-device-detect';
import GamewideInfo from '../../clientUtilities/GamewideInfo';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import socket from "../../clientUtilities/socket";
import "./css/styles.css";
import { useAuth0 } from "@auth0/auth0-react";

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

  const [gameInfo] = useState(initialGameInfo);

  const [day] = useState(true);

  const [activities, setActivities] = useState({
    sleeping: false,
    juggling: false,
    fighting: false,
    singing: false
  })

  const [inConversation, setConversation] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);

  const [input, setInput] = useState('');

  const [inputHistory, setInputHistory] = useState([]);

  const [playerPosition, setPlayerPosition] = useState('standing');

  const [actionCalls] = useState({
    move: ['move', '/m', 'walk', 'exit'],
    inventory: ['inventory', '/i', 'check inventory'],
    speak: ['speak', 'say', '/s'],
    look: ['look', '/l'],
    help: ['help', '/h'],
    get: ['get', '/g', 'pick up'],
    drop: ['drop', 'discard', '/d'],
    wear: ['wear', 'put on', 'don'],
    remove: ['remove', '/r', 'take off', "doff"],
    emote: ['emote', '/e', "/me"],
    juggle: ['juggle'],
    stats: ['stats'],
    sleep: ['sleep', 'fall asleep'],
    wake: ['wake', 'wake up', 'awaken'],
    position: ['lay down', 'lie down', 'stand up', 'sit down', 'sit up', 'sit', 'stand', 'lay', 'lie'],
    give: ['give'],
    examine: ['examine', 'study', 'inspect'],
    whisper: ['whisper to', '/w', 'whisper', 'speak to', 'say to', 'tell', 'talk to'],
  });

  //blur and select functions for input - to set min state
  const onSelect = () => {
    setMinState("min");
  }
  const onBlur = () => {
    setMinState("max")
  }

  const { isAuthenticated, isLoading } = useAuth0();

  // Socket log in message
  socket.off('log in').on('log in', async message => {
    let type = 'displayed-stat';
    setPlayer({
      ...player,
      characterName: message
    })
    setChatHistory(prevState => [...prevState, { type, text: `Welcome, ${message}! You are now logged in.` }]);

  });

  // Socket failed log in message
  socket.off('logFail').on('logFail', message => {
    if (message === "new user") {
      setPlayer({
        ...player,
        characterName: "newUser"
      });
      setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: 'Please enter a name for your new character!' }]);
      setChatHistory(prevState => [...prevState, { type: 'displayed-green', text: 'Your name must be no more than three words, and cannot be offensive.' }]);

    } else {
      let type = 'displayed-error';
      setChatHistory(prevState => [...prevState, { type, text: `${message}` }]);
    }
  });

  // Socket log out message
  socket.off('logout').on('logout', ({user, message}) => {
    let type = 'displayed-stat';
    setChatHistory(prevState => [...prevState, { type, text: message }]);
    if (user === player.characterName){
      setPlayer({});
      setLocation({});
    }
  });

  // Socket initial userData
  socket.off('playerData').on('playerData', message => {
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

  socket.off('who').on('who', ({ currentUsersOfRoom, userLocation }) => {
    currentUsersOfRoom = currentUsersOfRoom.map(elem => {
      return (elem === player.characterName) ? "You" : elem;
    })
    //sort to keep "You" in the beginning of the array
    currentUsersOfRoom = currentUsersOfRoom.sort(function (a, b) {
      if (a === "You") {
        return -1;
      } else if (b === "You") {
        return 1;
      } else {
        return 0;
      }
    });
    document.getElementById("location-info").innerHTML = "";
    document.getElementById("location-info").innerHTML = `${userLocation}: ${currentUsersOfRoom.join(", ")}`;
  })

  socket.off('data request').on('data request', () => {
    if (Object.keys(player).length !== 0) {
      socket.emit('add player', { player })
    }
  })

  //initialize console with black background, minState="max", and then fetch data for GamewideData
  useEffect(() => {
    let mounted = true;
    document.body.style.backgroundColor = 'black'
    if (isBrowser) {
      setMinState("max");
    }

    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(locationData => {
        mounted && socket.emit('location', locationData)
      });


    // sets a default chat history because chat history needs to be iterable to be mapped
    (isAuthenticated === false) && setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: 'Welcome to the Inn!' }]);

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
                  <div id="location-info">
                    <p
                      style={{ fontSize: "smaller" }}
                      className="mb-1">
                      {isLoading ? "Getting your room key..." : "Please type login to start!"}
                    </p>
                  </div>
                  <ChatPanel
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                    activities={activities}
                    setActivities={setActivities}
                    user={player}
                    location={location}
                    setLocation={setLocation}
                    day={day}
                    inConversation={inConversation}
                    setConversation={setConversation}
                    setPlayer={setPlayer}
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
                    inConversation={inConversation}
                    setConversation={setConversation}
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
      {/* {isAuthenticated ? <LogoutButton /> : <LoginButton />} */}
    </div>
  );
}

export default Console;