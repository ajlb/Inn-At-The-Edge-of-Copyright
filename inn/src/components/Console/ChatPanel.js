import React, { useState, useEffect, useContext } from 'react';
import GamewideInfo from "../../Utils/GamewideInfo";


function ChatPanel(props) {
    
    const gamewideInfo = useContext(GamewideInfo);
    console.log("ChatPanel:", gamewideInfo);
    
    const scrollToBottom = () => {
        anchorDiv.scrollIntoView({ behavior: "smooth" });
      }
    let anchorDiv;

    useEffect(() => {
        scrollToBottom();
    })

    
    return (
        <div className="message-output-box">
            <ul className="list-group chat-output"></ul>
            {
                gamewideInfo.map(action => {
                    return <li key={action.actionName}>{action.actionName}</li>
                })

            }   
            
            <div
            id="anchor"
            ref={(el) => anchorDiv=el }></div>
        </div>
    );

}


export default ChatPanel;