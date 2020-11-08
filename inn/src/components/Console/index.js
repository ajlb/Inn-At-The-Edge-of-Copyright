import React from "react";
import ChatPanel from "./ChatPanel";
import InputPanel from "./InputPanel";
import logo from "./images/logo.png"
import "./css/styles.css";

function Console() {
    return (
        <div>
            <figure>
                <img src={logo} alt="Inn At The Edge of Copyright Logo" id="logo"/>
            </figure>
            <div id="panel-border">
                <div class="panel-default">
                    <div id="panel-interior">
                    <div class="panel-heading"></div>
                    <div id="location-info"></div>
                    <ChatPanel />
                    <InputPanel />
                    </div>
                </div>
            </div>
            <footer id="about-link"><a href="/about">Meet our team!</a></footer>
        </div>
    );
}

export default Console;
