import React, { useState } from 'react';
import Nav from "./Nav";
import "./css/editorStyles.css";
import Body from "./Body";
import AdminInfo from "../../clientUtilities/AdminInfo";

function Editor(){

    const [ open, setOpen ] = useState(true);

    function openSidebar(){
        if (open){
            setOpen(false);
        } else {
            setOpen(true);
        }
    }
    return (
        <div id='wrapper'>
            <Nav 
            sidebarOpen={open}
            />
            <Body 
            toggleClick={openSidebar}
            />
        </div>
    )
}

export default Editor;