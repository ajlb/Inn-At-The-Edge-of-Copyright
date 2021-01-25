import React from 'react';
import LocationViewAll from "./bodies/Locations/ViewAll";
import EditOneLocation from "./bodies/Locations/EditOne";
import CreateOneLocation from "./bodies/Locations/CreateOne";
import PlayerViewAll from "./bodies/Players/ViewAll";
import EditOnePlayer from "./bodies/Players/EditOne";
import CreateOnePlayer from "./bodies/Players/CreateOne";
import Dialogs from "./bodies/Dialogs/index";

function Body({ destinationState }) {

    switch (destinationState.collection) {
        case "Locations":
            switch (destinationState.action) {
                case "View:All":
                    return <LocationViewAll />
                case "Edit:One":
                    return <EditOneLocation />
                case "Create:New":
                    return <CreateOneLocation />
                default:
                    return null;
            }
        case "Players":
            switch (destinationState.action) {
                case "View:All":
                    return <PlayerViewAll />
                case "Edit:One":
                    return <EditOnePlayer />
                case "Create:New":
                    return <CreateOnePlayer />
                default:
                    return null;
            }
        case "Dialogs":
            return <Dialogs action={destinationState.action} />;

        default:
            return null;
    }
}

export default Body;