import React, { useEffect } from 'react';
import socket from "../../clientUtilities/socket";
import { insertArticleSingleValue } from "../../clientUtilities/parsers";
import { clearJuggleTime } from "./js/juggle";
import { getOneOfTheseOffThat, takeTheseOffThat } from '../../clientUtilities/finders';
import { ConnectionStates } from 'mongoose';
//import {updateHourly} from './js/weather';




//note if user is scrolled to bottom of div
let scrolledToBottom = true;

function ChatPanel({
    // props being handed to the user via the console component
    chatHistory,
    setChatHistory,
    location,
    setLocation,
    activities,
    setActivities,
    user,
    day,
    inConversation,
    setConversation,
    setPlayer,
    setReplyTo
}) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;

    // This is where most socket client listeners are going to be!
    socket.off('whisperTo').on('whisperTo', ({ message, userFrom }) => {
        let type = 'displayed-stat';
        setReplyTo({ to: userFrom });
        setChatHistory(prevState => [...prevState, { type, text: `<span className='displayed-dimBlue'>Whisper from ${userFrom}:</span> ${message}` }]);
        // chat history is mapped down below
    });

    socket.off('from NPC').on('from NPC', ({ NPCName, NPCMessage, exampleResponses, leavingConversation, route }) => {
        if (leavingConversation) {
            setConversation(false)
        } else {
            setConversation({ with: NPCName, route })
        }

        setChatHistory(prevState => [...prevState, { type: 'displayed-npc mt-3', text: `${NPCName}: ${NPCMessage}` }]);
        if (exampleResponses && !leavingConversation) {
            setChatHistory(prevState => [...prevState, { type: 'displayed-commands', text: `Respond with: ${exampleResponses.join(', ')}` }]);
        }
    })

    //failed user command messages
    socket.off('failure').on('failure', (message) => {
        let type = 'displayed-error';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });


    //failed user command messages
    socket.off('genericMessage').on('genericMessage', (message) => {
        // console.log("received generic message", message);
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });


    //system message to user
    socket.off('green').on('green', (message) => {
        let type = 'displayed-green';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    //view other people's movement
    socket.off('move').on('move', ({ actor, direction, cardinal, action }) => {
        let messageDisplay = '';
        if (actor === user.characterName) {
            if (action === "leave") {
                cardinal ? messageDisplay = `You leave to the ${direction}.` : messageDisplay = `You leave by the ${direction}.`;
            } else {
                messageDisplay = `You arrive from the ${direction}.`;
            }
        } else {
            if (action === "leave") {
                cardinal ? messageDisplay = `${actor} leaves to the ${direction}.` : messageDisplay = `${actor} leaves by the ${direction}.`;
            } else {
                messageDisplay = `${actor} arrives from the ${direction}.`;
            }
        }
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: messageDisplay }]);
    });

    //receive your own move
    socket.off('yourMove').on('yourMove', (direction) => {
        try {
            let newDescription = day ? location[direction].dayDescription : location[direction].nightDescription;
            setChatHistory(prevState => [...prevState, { type: 'displayed-intro', text: `You enter: ${location[direction].locationName}` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: newDescription }]);
            let exits = [];
            for (const param in location[direction].exits) {
                // console.log(param)
                if (param !== "current" && !location[direction].exits[param].hidden) {
                    exits.push(param);
                }
            }
            const fightables = location[direction].fightables.filter(en => en.isAlive);
            if (fightables) {
                // console.log(fightables);
                if (fightables.length > 0) {
                    setChatHistory(prevState => [...prevState, {
                        type: 'displayed-stat', text: `You see some creatures prowling around this area: <span className='text-warning'>${fightables.map(en => {
                            return en.name;
                        }).join(", ")}</span>.`
                    }]);

                }
            }
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `Exits: ${exits.join(", ")}` }]);
        } catch (e) {
            socket.emit('failure', "Hmmm... it seems like something went wrong.");
            console.log("error from receive yourMove");
            console.log(e.message);
        }


    });



    // Socket location chunk
    socket.off('locationChunk').on('locationChunk', message => {
        // console.log('received locationChunk');
        // console.log(message);
        if (location.current === undefined) {
            let newDescription = day ? message.current.dayDescription : message.current.nightDescription;
            setChatHistory(prevState => [...prevState, { type: 'displayed-intro', text: `You are in: ${message.current.locationName}` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: newDescription }]);
            let exits = [];
            for (const param in message) {
                if (param !== "current" && !message[param].hidden) {
                    exits.push(param);
                }
            }
            const fightables = message.current.fightables.filter(en => en.isAlive);
            if (fightables) {
                // console.log(fightables);
                if (fightables.length > 0) {
                    setChatHistory(prevState => [...prevState, {
                        type: 'displayed-stat', text: `You see some creatures prowling around this area: <span className='text-warning'>${fightables.map(en => {
                            return en.name;
                        }).join(", ")}</span>.`
                    }]);

                }
            }
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `Exits: ${exits.join(", ")}` }]);

        }
        if (!(message === null)) {
            setLocation(message);
        }
    });

    // This is where most socket client listeners are going to be!
    socket.off('whisperFrom').on('whisperFrom', ({ message, userTo }) => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: `<span className='displayed-dimBlue'>Whisper to ${userTo}:</span> ${message}` }]);
        // chat history is mapped down below
    });

    //room speech
    socket.off('speak').on('speak', (message) => {
        let type = 'displayed-stat';
        if (!inConversation) {
            setChatHistory(prevState => [...prevState, { type, text: message }]);
        }
    });

    //eat message
    socket.off('eat').on('eat', ({ actor, eatenItem, actorMessage }) => {
        let type = 'displayed-stat';
        if (actor.toLowerCase() === user.characterName.toLowerCase()) {
            setChatHistory(prevState => [...prevState, { type, text: `You eat ${insertArticleSingleValue(eatenItem)}. ${actorMessage}` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type, text: `${actor} eats ${insertArticleSingleValue(eatenItem)}.` }]);
            }
        }
    });


    //shout
    socket.off('shout').on('shout', ({ userMessage, fromUser }) => {
        if (!inConversation) {
            setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: userMessage }]);
        }
    });

    //a get action
    socket.off('get').on('get', ({ target, actor }) => {
        let type = 'displayed-stat';
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `You pick up ${insertArticleSingleValue(target)}.` }]);
        } else {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} picks up ${insertArticleSingleValue(target)}.` }]);
        }
    });

    //a drop action
    socket.off('drop').on('drop', ({ target, actor }) => {
        let type = 'displayed-indent';
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `You drop ${insertArticleSingleValue(target)}.` }]);
        } else {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} drops ${insertArticleSingleValue(target)}.` }]);
        }
    });

    //a give action
    socket.off('give').on('give', ({ target, item, actor }) => {
        let type = 'displayed-stat';
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `You give ${insertArticleSingleValue(item)} to ${target}.` }]);
        } else if (target === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} gives ${insertArticleSingleValue(item)} to you.` }]);
        } else {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} gives ${insertArticleSingleValue(item)} to ${target}.` }]);
        }
    });

    //emote
    socket.off('emote').on('emote', ({ username, emotion, muteEmoter }) => {
        let type = 'displayed-stat';
        if ((!muteEmoter) || (muteEmoter && username !== user.characterName)) {
            setChatHistory((prevState => [...prevState, { type, text: `${username} ${emotion}` }]))
        }
    })

    //sleep
    socket.off('sleep').on('sleep', ({ userToSleep, quiet }) => {
        if (userToSleep === user.characterName) {
            setActivities(prevState => { return { ...prevState, sleeping: true } });
            if (!quiet) setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `You fall asleep.` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `${userToSleep} falls asleep.` }]);
            }
        }
    })

    //wake
    socket.off('wake').on('wake', ({ userToWake, quiet }) => {
        if (userToWake === user.characterName) {
            setActivities(prevState => { return { ...prevState, sleeping: false } });
            if (!quiet) setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `You wake up.` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `${userToWake} wakes up.` }]);
            }
        }
    })

    //juggle
    socket.off('juggle').on('juggle', ({ user, target, num }) => {
        if (user === user.characterName) {
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `You begin to juggle ${num} ${target}.` }]);
            setActivities({
                ...activities,
                juggling: true
            });
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `${user} begins to juggle ${num} ${target}.` }]);
            }
        }
    })

    socket.off('contJuggle').on('contJuggle', ({ user, target, num }) => {
        if (user === user.characterName) {
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `You juggle ${num} ${target}.` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: `${user} juggles ${num} ${target}.` }]);
            }
        }
    })

    socket.off('stop juggle').on('stop juggle', ({ actor, roomMessage, userMessage }) => {
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: userMessage }]);
            setActivities({
                ...activities,
                juggling: false
            });
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: roomMessage }]);
            }
        }
        // console.log('calling clear juggle time');
        clearJuggleTime();
    })

    //wear
    socket.off('wear').on('wear', message => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    socket.off('remove').on('remove', message => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });


    socket.off('dayNight').on('dayNight', day => {
        const time = day ? "day" : "night"
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `It has become ${time}.` }]);

        setPlayer({
            ...user,
            day
        });
    })

    socket.off('error').on('error', ({ message }) => {
        let type = 'displayed-error';
        setChatHistory(prevState => [...prevState, { type, text: `${message}` }]);
    });

    socket.off('help').on('help', ({ actionData, type }) => {
        if (type === "whole") {
            let newArray = [];
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `HELP` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);
            actionData.forEach((helpItem) => {
                newArray = (`(${helpItem.actionName}) -  ${helpItem.commandBriefDescription}.`);
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: newArray }]);
            });
        } else {
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `----- ${actionData.actionName.toUpperCase()} -----` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: actionData.commandLongDescription }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `\xa0\xa0\xa0\xa0` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `Ways to call it: ${actionData.waysToCall} \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Example: ${actionData.exampleCall}` }]);
        }
    });

    socket.off('weatherData').on('weatherData', ({ regionWeather, regionName }) => {
        try {
            if (regionName === location.current.region) {
                setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: regionWeather }]);
            }
            console.log(location);
            for (const param in location) {
                if (location[param].region === regionName) {
                    const editedLocation = location;
                    editedLocation[param].weather = regionWeather;
                    setLocation(editedLocation);
                }
            }
        } catch (e) {
            console.log("ERROR FROM weatherData(ChatPanel.js)");
            console.log(e);
        }
    });


    socket.off('stats').on('stats', () => {

    });

    //where is the user scrolled to?
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            scrolledToBottom = true;
        } else if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight > 100) {
            scrolledToBottom = false;
        }
    };

    //effect runs on every update to chatHistory
    useEffect(() => {
        //pin to bottom after every render unless user is scrolled up
        if (scrolledToBottom) {
            anchorDiv.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, anchorDiv]);

    // used below to create unique keys for the rendered list items
    let i = 0;

    return (
        <div className="message-output-box" onScroll={handleScroll}>
            <ul className="list-group chat-output"></ul>
            {
                chatHistory.map(message => {
                    i++;
                    let text = message.text;
                    if (text.includes("<span className=")) {
                        let spanClass = text.split(`'>`)[0];
                        spanClass = spanClass.replace(`<span className='`, "");
                        let spanText = text.slice(text.indexOf(">") + 1);
                        spanText = spanText.slice(0, spanText.indexOf("<"));
                        let textAfterSpan = text.split("</span>")[1];
                        let textBeforeSpan = text.split("<span")[0];
                        return <p key={i} className={message.type}>{textBeforeSpan}<span className={spanClass}>{spanText}</span>{textAfterSpan}</p>
                    } else {
                        return <p key={i} className={message.type}>{text}</p>
                    }
                })
            }
            <div
                id="anchor"
                ref={(el) => anchorDiv = el}></div>
        </div>
    );
}

export default ChatPanel;