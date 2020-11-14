import { useContext } from "react";
import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import GamewideInfo from "../../Utils/GamewideInfo";



function InputPanel(props) {
    //get context provider
    const gamewideInfo = useContext(GamewideInfo);

    //set up reference to user input bar
    let inputEl;
    //set up index for current position in chatHistory
    let chatIndex;


    //display previous commands on key up, key down
    const keyDownResults = (event) => {
        //up arrow
        if (event.which === 38) {
            //stop at 0
            chatIndex > 0 ? chatIndex -= 1 : chatIndex = 0;
            inputEl.value = gamewideInfo.chatHistory[chatIndex].text
            //down arrow
        } else if (event.which === 40) {
            //stop at chatHistory length
            chatIndex < gamewideInfo.chatHistory.length ? chatIndex += 1 : chatIndex = gamewideInfo.chatHistory.length;
            //if chatIndex is less than length, show indexed message, otherwise show ""
            chatIndex < gamewideInfo.chatHistory.length ? inputEl.value = gamewideInfo.chatHistory[chatIndex].text : inputEl.value = "";
            //enter key
        } else if (event.which === 13) {
            //reset chatIndex to end
            chatIndex = gamewideInfo.chatHistory.length + 1;
        }

    }

    return (
        <div>
            <BrowserView>
                <div className="input-box">
                    <form
                        onSubmit={props.onSubmit}
                    >
                        <div id="input-group">
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
                                ref={(el) => inputEl = el}
                                onChange={props.onChange}
                                type="text"
                                id="inputBar"
                                className="form-control chat-input" autoFocus="autofocus"
                                autoComplete="off"
                                onKeyDown={keyDownResults}
                            />
                            <span className="input-group-btn">
                                <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                            </span>
                        </div>
                    </form>
                </div>
            </BrowserView>
            <MobileView>
                <div className="input-box">
                    <form
                        onSubmit={props.onSubmit}
                    >
                        <div
                            id="input-group"
                            style={{
                                width: props.minState === "min" && 100 + "%"
                            }}
                        >
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
                                onChange={props.onChange}
                                type="text"
                                id="inputBar"
                                className="form-control chat-input"
                                onBlur={props.onBlur}
                                onSelect={props.onSelect}
                                autoComplete="off"
                            />
                            <span className="input-group-btn">
                                <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                            </span>
                        </div>
                    </form>
                </div>
            </MobileView>
        </div>
    )

}


export default InputPanel;