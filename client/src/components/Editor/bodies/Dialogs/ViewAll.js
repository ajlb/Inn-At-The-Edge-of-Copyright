import { useContext } from "react";
import AdminInfo from "../../../../clientUtilities/AdminInfo";

function ViewAll({
    dialogs,
    setDialogs
}) {

    const darkListItem = "list-group-item border border-dark rounded mb-3 bg-light";
    const lightListItem = "list-group-item border rounded mb-3";
    const ulStyle = { display: "inline-flex", flexFlow: "row wrap", justifyContent: "flex-start" };

    const adminInfo = useContext(AdminInfo);

    return (
        <main id="dialog-wrapper" style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }} >
            {dialogs.map(({ NPC, messages }) => {
                return (
                    <section key={NPC + JSON.stringify(messages)}>
                        <h1>{NPC}</h1>
                        <ul className="list-group">
                            {messages.map(({ message, responses, routeNumber, action, socketProp, leavingConversation }) => {
                                return (
                                    <li id={NPC + routeNumber} key={message} className={darkListItem}>

                                        <h5>Message:</h5>
                                        <p className="bg-white border rounded p-2">{message}</p>

                                        {responses && <h5>Responses:</h5>}
                                        {responses ?
                                            <ul className="list-group">
                                                {responses.map(({ example, allowed, conditionals, route }) => {
                                                    return (<li key={JSON.stringify(allowed)} className={lightListItem}>

                                                        <p>Example: {example}</p>
                                                        <p>Allowed:</p>
                                                        <ul className="list-group" style={ulStyle}>
                                                            {allowed.map(s => <li key={s} className={darkListItem + ' col-auto mx-2'}>{s}</li>)}
                                                        </ul>

                                                        {conditionals && <p>Conditionals:</p>}
                                                        {conditionals ?
                                                            <ul className="list-group" style={ulStyle}>
                                                                {conditionals.map(({ condition, ...props }) => {
                                                                    return <li key={JSON.stringify(props)} className={darkListItem + " mx-2"}>
                                                                        {condition}: {Object.values(props)[0]}
                                                                    </li>
                                                                })}
                                                            </ul>
                                                            :
                                                            <span></span>}

                                                        <p>Route: <a href={`#${NPC}${route}`}>{route}</a></p>

                                                    </li>)
                                                })}
                                            </ul>
                                            :
                                            <span />
                                        }

                                        {action && <h5>Action: {action}</h5>}
                                        {socketProp && <h5>Socket Property: {socketProp}</h5>}

                                        {leavingConversation && <h5>Leave Conversation: {leavingConversation.toString()}</h5>}

                                    </li>
                                )
                            })}
                        </ul>
                    </section>

                )
            })}
        </main>
    )
}

export default ViewAll;