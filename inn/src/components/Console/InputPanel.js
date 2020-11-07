import React from "react";
import "./css/styles.css";

function ChatPanel() {
    return (
        <div class="input-box">
            <form>
                <div id="input-group">
                    <label for="inputBar" id="hidden-text">User Input Bar: </label>
                    <input type="text" id="inputBar" className="form-control chat-input" autofocus="autofocus" onfocus="this.select()" />
                    <span class="input-group-btn">
                        <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default ChatPanel;