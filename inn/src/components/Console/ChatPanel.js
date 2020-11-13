import React, { useState, useEffect } from 'react';
import getActions from "../../Utils/API";


function ChatPanel(props) {
    const [actions, setActions] = useState([]);



    useEffect(() => {

        getActions().then(actionData => {
            setActions(actionData.data);
        });

    }, [])
    return (
        <div className="message-output-box">
            <ul className="list-group chat-output"></ul>
            {actions.map(action => {
                return <li>{action.actionName}</li>
            })
        }
            
            <div id="anchor"></div>
        </div>
    );

}


export default ChatPanel;