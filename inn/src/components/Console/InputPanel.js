import {
    MobileView,
    BrowserView
} from 'react-device-detect';

const styles = {
    inputGroup: {
        width: "100%"
    },
}



function InputPanel(props) {

    return (
        <div>
            <BrowserView>
                <div className="input-box">
                    <form>
                        <div id="input-group">
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
                                type="text"
                                id="inputBar"
                                className="form-control chat-input" autoFocus="autofocus"
                                autoComplete="off"
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
                    <form>
                        <div 
                        id="input-group"
                        style={{
                            width: props.minState==="min" && 100+"%" 
                        }}
                        >
                            <label htmlFor="inputBar" id="hidden-text">User Input Bar: </label>
                            <input
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