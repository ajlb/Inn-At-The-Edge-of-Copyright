import React, { useEffect, useContext } from 'react';
import GamewideInfo from "../../Utils/GamewideInfo";

//note if user is scrolled to bottom of div
let scrolledToBottom = true

function ChatPanel(props) {
    //prepare variable to hold div reference for scrolling
    let anchorDiv;

    //get context provider
    const gamewideInfo = useContext(GamewideInfo);

    //where is the user scrolled to?
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            scrolledToBottom = true;
        } else if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight > 100){
            scrolledToBottom = false;
        }
    }

    //effect runs on every update to chatHistory
    useEffect(() => {
        //pin to bottom after every render unless user is scrolled up
        if (scrolledToBottom){
            anchorDiv.scrollIntoView({ behavior: "smooth" });
        }
    }, [gamewideInfo.chatHistory, anchorDiv])

    let i = 0;

    return (
        <div className="message-output-box" onScroll={handleScroll}>
            <ul className="list-group chat-output"></ul>
            {
                gamewideInfo.chatHistory.map(message => {
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

export {

};