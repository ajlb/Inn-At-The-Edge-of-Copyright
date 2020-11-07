import React from "react";
import "./css/styles.css";

function ChatPanel() {
    return (
        <div class="input-box">
            <form>
                <div class="input-group">
                    <label for="inputBar" id="hidden-text">User Input Bar: </label>
                    <input type="text" id="inputBar" class="form-control chat-input" autofocus="autofocus" onfocus="this.select()" />
                    <span class="input-group-btn">
                        <button type="submit" id="submit-button" class="btn btn-default">=&gt;</button>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default ChatPanel;