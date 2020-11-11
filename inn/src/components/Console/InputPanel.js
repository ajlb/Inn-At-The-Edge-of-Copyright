import {
    MobileView,
    BrowserView
} from 'react-device-detect';



function InputPanel(props) {

    return (
        <div>
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
                        {(props.minState === "max") ?
                            <div id="input-group">
                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                <input
                                    type="text"
                                    id="inputBar"
                                    className="form-control chat-input"
                                    onBlur={props.onBlur}
                                    onSelect={props.onSelect}
                                />
                                <span class="input-group-btn">
                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                </span>
                            </div>
                            :
                            <div id="input-group" style={{width: 100+"%"}}>
                                <label for="inputBar" id="hidden-text">User Input Bar: </label>
                                <input
                                    type="text"
                                    id="inputBar"
                                    className="form-control chat-input"
                                    onBlur={props.onBlur}
                                    onSelect={props.onSelect}
                                />
                                <span class="input-group-btn">
                                    <button type="submit" id="submit-button" className="btn btn-default fa fa-arrow-right"></button>
                                </span>
                            </div>
                        }
                    </form>
                </div>
            </MobileView>
        </div>
    )

}


export default InputPanel;