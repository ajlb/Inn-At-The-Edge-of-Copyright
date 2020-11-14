import React, { useState, useEffect, useContext } from 'react';
import GamewideInfo from "../../Utils/GamewideInfo";


function ChatPanel(props) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;
    
    //get context provider
    const gamewideInfo = useContext(GamewideInfo);
    
    
    //effect on render
    useEffect(() => {

        //pin to bottom after every render
        const scrollToBottom = () => {
            anchorDiv.scrollIntoView({ behavior: "smooth" });
        }

        scrollToBottom();
    }, [gamewideInfo.chatHistory, anchorDiv])
    
    let i = 0;

    return (
        <div className="message-output-box">
            <ul className="list-group chat-output"></ul>
            {
                gamewideInfo.chatHistory.map(message => {
                    i++;
                    return <p key={i} className={message.type}>{message.text}</p>
                })
            }   
            <div
            id="anchor"
            ref={(el) => anchorDiv=el }></div>
        </div>
    );

}


export default ChatPanel;

export {
    
};