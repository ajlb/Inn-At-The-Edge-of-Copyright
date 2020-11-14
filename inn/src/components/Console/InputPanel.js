import { useContext } from "react";
import {
    MobileView,
    BrowserView
} from 'react-device-detect';
import GamewideInfo from "../../Utils/GamewideInfo";


//set up index for current position in userCommandsHistory
let commandIndex;

function InputPanel(props) {
    //get context provider
    const gamewideInfo = useContext(GamewideInfo);

    //set up reference to user input bar
    let inputEl;


    //display previous commands on key up, key down
    const keyDownResults = (event) => {
        //up arrow
        if (event.which === 38) {
            //stop at 0
            commandIndex > 0 ? commandIndex -= 1 : commandIndex = 0;
            inputEl.value = gamewideInfo.userCommandsHistory[commandIndex]
            //down arrow
        } else if (event.which === 40) {
            //stop at userCommandsHistory length
            commandIndex < gamewideInfo.userCommandsHistory.length ? commandIndex += 1 : commandIndex = gamewideInfo.userCommandsHistory.length;
            //if commandIndex is less than length, show indexed message, otherwise show ""
            commandIndex < gamewideInfo.userCommandsHistory.length ? inputEl.value = gamewideInfo.userCommandsHistory[commandIndex].text : inputEl.value = "";
            //enter key
        } else if (event.which === 13) {
            //reset commandIndex to end
            commandIndex = gamewideInfo.userCommandsHistory.length + 1;
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