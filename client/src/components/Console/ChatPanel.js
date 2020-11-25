import React, { useEffect } from 'react';
import socket from "../../clientUtilities/socket";

//note if user is scrolled to bottom of div
let scrolledToBottom = true;

function ChatPanel({
    // props being handed to the user via the console component
    chatHistory,
    setChatHistory,
    location,
    user,
    day
}) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;

    // This is where most socket client listeners are going to be!
    socket.off('whisperTo').on('whisperTo', ({ message, userFrom }) => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: `Whisper from ${userFrom}: ${message}` }]);
        // chat history is mapped down below
    });

    socket.off('failure').on('failure', (message) => {
        let type = 'displayed-error';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });


    socket.off('move').on('move', (message) => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: message }]);
    });

    socket.off('yourMove').on('yourMove', (direction) => {
        let newDescription = day ? location[direction].dayDescription : location[direction].nightDescription;
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: " " }]);
        setChatHistory(prevState => [...prevState, { type, text: `You enter: ${location[direction].locationName}` }]);
        setChatHistory(prevState => [...prevState, { type, text: newDescription }]);
    });

    // This is where most socket client listeners are going to be!
    socket.off('whisperFrom').on('whisperFrom', ({ message, userTo }) => {
        let type = 'displayed-stat';
        setChatHistory(prevState => [...prevState, { type, text: `Whisper to ${userTo}: ${message}` }]);
        // chat history is mapped down below
    });

    socket.off('error').on('error', ({ status, message }) => {
        let type = 'error-message';
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