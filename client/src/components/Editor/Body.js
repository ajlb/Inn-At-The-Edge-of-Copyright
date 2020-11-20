import React from 'react';
import LocationViewAll from "./bodies/Locations/ViewAll";
import EditOneLocation from "./bodies/Locations/EditOne";


function Body({ destinationState }){
    console.log(destinationState.collection);

    switch (destinationState.collection) {
        case "Locations":
            switch (destinationState.action) {
                case "View:All":
                    return <LocationViewAll/>
            
                case "Edit:One":
                    return <EditOneLocation/>
                default:
                    return null;
            }
            
    
        default:
            return null;
    }
}

export default Body;