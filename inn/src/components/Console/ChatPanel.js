import React, { useEffect, useContext } from 'react';
import GamewideInfo from "../../Utils/GamewideInfo";


function ChatPanel(props) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;
    
    //get context provider
    const gamewideInfo = useContext(GamewideInfo);
    
    
    //effect runs on every update to chatHistory
    useEffect(() => {
        //pin to bottom after every render
        anchorDiv.scrollIntoView({ behavior: "smooth" });
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