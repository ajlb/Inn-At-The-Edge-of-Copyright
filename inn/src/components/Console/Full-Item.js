import React, { useEffect, useState } from "react";
import logo from "./images/logo.png"
import "./css/styles.css";
import {
    BrowserView,
    MobileView,
    isBrowser
} from "react-device-detect";




function Console() {


    const [minState, setMinState] = useState("max");

    const onSelect = () => {
        console.log("SELECTED");
        setMinState("min");

    }

    const onBlur = () => {
        console.log("BLURRED");
        setMinState("max")
    }


    useEffect(() => { document.body.style.backgroundColor = 'black' }, []);

    React.useEffect(() => {
        setTimeout(window.scrollTo(0, 0), 500);
    }, []);


    return (
        <div>
            <div className="wrapper">
                {(minState === "max") ?
                    <figure>
                        <img src={logo} alt="Inn At The Edge of Copyright Logo" id="logo" />
                    </figure>
                    :
                    <figure style={{ display: "none" }}>
                        <img src={logo} alt="Inn At The Edge of Copyright Logo" id="logo" />
                    </figure>

                }


                {(minState === "max") ?
                    <div id="panel-border">
                        <div class="panel-default">
                            <div id="panel-interior">
                                <div class="panel-heading"></div>
                                <div id="location-info"></div>
                                <div class="message-output-box">
                                    <ul class="list-group chat-output"></ul>
                                    <div id="anchor">word</div>
                                </div>
                                <BrowserView>
                                    <div class="input-box">
                                        <form>
                                            <div id="input-group">
                                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                                <input
                                                    type="text"
                                                    id="inputBar"
                                                    className="form-control chat-input" autofocus="autofocus"
                                                />
                                                <span class="input-group-btn">
                                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </BrowserView>
                                <MobileView>
                                    <div class="input-box">
                                        <form>
                                            <div id="input-group">
                                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                                <input
                                                    type="text"
                                                    id="inputBar"
                                                    className="form-control chat-input"
                                                    onBlur={onBlur}
                                                    onSelect={onSelect}
                                                />
                                                <span class="input-group-btn">
                                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </MobileView>
                            </div>
                        </div>
                    </div>
                    :
                    <div id="panel-border" style={{ height: 50 + "vh", width: 100 + "vw" }}>
                        <div class="panel-default" style={{ height: 100 + "%", width: 100 + "%" }}>
                            <div id="panel-interior">
                                <div class="panel-heading"></div>
                                <div id="location-info"></div>
                                <div class="message-output-box">
                                    <ul class="list-group chat-output"></ul>
                                    <div id="anchor">word</div>
                                </div>
                                <BrowserView>
                                    <div class="input-box">
                                        <form>
                                            <div id="input-group">
                                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                                <input
                                                    type="text"
                                                    autocomplete="off"
                                                    id="inputBar"
                                                    className="form-control chat-input" autofocus="autofocus"
                                                />
                                                <span class="input-group-btn">
                                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </BrowserView>
                                <MobileView>
                                    <div class="input-box">
                                        <form>
                                            <div id="input-group">
                                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                                <input
                                                    type="text"
                                                    autocomplete="off"
                                                    id="inputBar"
                                                    className="form-control chat-input"
                                                    onBlur={onBlur}
                                                    onSelect={onSelect}
                                                />
                                                <span class="input-group-btn">
                                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </MobileView>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {((minState === "max") || isBrowser) &&
                <div className="push"></div>
            }
            {((minState === "max") || isBrowser) &&
                <footer id="about-link"><a style={{ color: "white" }} href="/about">Meet our team!</a></footer>
            }
        </div>
    );
}

export default Console;
