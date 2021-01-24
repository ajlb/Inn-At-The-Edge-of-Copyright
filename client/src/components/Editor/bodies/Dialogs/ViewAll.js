import { useContext, useEffect } from "react";
import AdminInfo from "../../../../clientUtilities/AdminInfo";

function ViewAll({
    dialogs,
    setDialogs
}) {

    const darkListItem = "list-group-item border border-dark rounded mb-3 bg-light";
    const lightListItem = "list-group-item border rounded mb-3";

    const adminInfo = useContext(AdminInfo);

    return (
        <main id="dialog-wrapper" style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }} >
            {dialogs.map(({ NPC, messages }) => {
                return (
                    <section key={NPC + messages}>
                        <h1>{NPC}</h1>
                        <ul className="list-group">
                            {messages.map(({ message, responses, routeNumber }) => {
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
                                                        <ul className="list-group">
                                                            {allowed.map(s => <li key={s} className={darkListItem}>{s}</li>)}
                                                        </ul>
                                                        {conditionals && <p>Conditionals:</p>}
                                                        {conditionals ?
                                                            <ul className="list-group">
                                                                {conditionals.map(({ condition, ...props }) => {
                                                                    return <li key={JSON.stringify(props)} className={darkListItem}>
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