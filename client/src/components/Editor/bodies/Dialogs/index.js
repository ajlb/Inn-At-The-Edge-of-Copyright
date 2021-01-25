import { useState, useEffect } from "react";
import { getAllDialogs } from "../../../../clientUtilities/adminAPIs";

import ViewAll from "./ViewAll";
// import EditOne from "./EditOne";
// import CreateOne from "./CreateOne";
import "./style.css";

function Dialogs({ action }) {

    const [dialogs, setDialogs] = useState([]);

    useEffect(() => {
        getAllDialogs()
            .then(({ data }) => setDialogs(data))
            .catch(e => console.log(e))
    }, [])

    switch (action) {
        case "View:All":
            return <ViewAll
                dialogs={dialogs}
                setDialogs={setDialogs}
            />;
        default:
            return null;
    }
}

export default Dialogs;