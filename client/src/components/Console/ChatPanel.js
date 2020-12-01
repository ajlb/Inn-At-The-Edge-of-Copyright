import React, { useEffect } from 'react';
import socket from "../../clientUtilities/socket";
import { insertArticleSingleValue } from "../../clientUtilities/parsers";
import { clearJuggleTime } from "./js/juggle";



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
    setConversation
}) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;

    // This is where most socket client listeners are going to be!
    socket.off('whisperTo').on('whisperTo', ({ message, userFrom }) => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: `Whisper from ${userFrom}: ${message}` }]);
        // chat history is mapped down below
    });

    socket.off('from NPC').on('from NPC', ({ NPCName, NPCMessage, exampleResponses, leavingConversation }) => {
        if (leavingConversation) {
            setConversation(false)
        } else {
            setConversation({ with: NPCName })
        }

        setChatHistory(prevState => [...prevState, { type: 'displayed-npc', text: `${NPCName}: ${NPCMessage}` }]);
        if (exampleResponses && !leavingConversation) {
            setChatHistory(prevState => [...prevState, { type: 'displayed-commands', text: `Respond with: ${exampleResponses}` }]);
        }
    })

    //failed user command messages
    socket.off('failure').on('failure', (message) => {
        let type = 'displayed-error';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });


    //system message to user
    socket.off('green').on('green', (message) => {
        let type = 'displayed-green';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    //view other people's movement
    socket.off('move').on('move', ({actor, direction, cardinal, action}) => {
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
        let newDescription = day ? location[direction].dayDescription : location[direction].nightDescription;
        setChatHistory(prevState => [...prevState, { type: 'displayed-intro', text: `You enter: ${location[direction].locationName}` }]);
        setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: newDescription }]);
        let exits = [];
        for (const param in location[direction].exits) {
            if (param !== "current") {
                exits.push(param);
            }
        }
        setChatHistory(prevState => [...prevState, { type: 'displayed-indent', text: `Exits: ${exits.join(", ")}` }]);


    });



    // Socket location chunk
    socket.off('locationChunk').on('locationChunk', message => {
        console.log("recieved locationChunk");
        console.log(message);
        if (location.current === undefined) {
            let newDescription = day ? message.current.dayDescription : message.current.nightDescription;
            setChatHistory(prevState => [...prevState, { type: 'displayed-intro', text: `You are in: ${message.current.locationName}` }]);
            setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: newDescription }]);
            let exits = [];
            for (const param in message) {
                if (param !== "current") {
                    exits.push(param);
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
        setChatHistory(prevState => [...prevState, { type, text: `Whisper to ${userTo}: ${message}` }]);
        // chat history is mapped down below
    });

    //room speech
    socket.off('speak').on('speak', (message) => {
        let type = 'displayed-stat';
        console.log(inConversation)
        if (!inConversation) {
            setChatHistory(prevState => [...prevState, { type, text: message }]);
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
        let type = 'displayed-stat';
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `You drop ${insertArticleSingleValue(target)}.` }]);
        } else {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} drops ${insertArticleSingleValue(target)}.` }]);
        }
    });

    //a give action
    socket.off('give').on('give', ({ target, item, actor }) => {
        console.log("give received");
        let type = 'displayed-stat';
        if (actor === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `You give ${insertArticleSingleValue(item)} to ${target}.` }]);
        } else if (target === user.characterName) {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} gives ${insertArticleSingleValue(item)} to you.` }]);
        } else {
            setChatHistory(prevState => [...prevState, { type, text: `${actor} gives ${insertArticleSingleValue(item)} to ${target}.` }]);
        }
    });

    socket.off('sleep').on('sleep', ({ userToSleep }) => {
        if (userToSleep === user.characterName) {
            setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `You fall asleep.` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `${userToSleep} falls asleep.` }]);
            }
        }
    })

    socket.off('wake').on('wake', ({ userToWake }) => {
        if (userToWake === user.characterName) {
            setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `You wake up.` }]);
        } else {
            if (!inConversation) {
                setChatHistory(prevState => [...prevState, { type: "displayed-stat", text: `${userToWake} wakes up.` }]);
            }
        }
    })


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

    socket.off('stop juggle').on('stop juggle', ({ user, roomMessage, userMessage }) => {
        if (user === user.characterName) {
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
        clearJuggleTime();
    })

    socket.off('wear').on('wear', message => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    socket.off('remove').on('remove', message => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    socket.off('error').on('error', ({ status, message }) => {
        let type = 'displayed-error';
        setChatHistory(prevState => [...prevState, { type, text: `${status} Error: ${message}` }]);
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
                    return <p key={i} className={message.type}>{message.text}</p>
                })
            }
            <div
                id="anchor"
                ref={(el) => anchorDiv = el}></div>
        </div>
    );
}

export default ChatPanel;