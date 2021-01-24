import ViewAll from "./ViewAll";
import EditOne from "./EditOne";
import CreateOne from "./CreateOne";

function Dialogs({ action }) {
    switch (action) {
        case "View:All":
            return <ViewAll />;
        default:
            return null;
    }
}

export default Dialogs;