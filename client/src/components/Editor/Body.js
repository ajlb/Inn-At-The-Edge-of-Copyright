import React from 'react';
import LocationViewAll from "./bodies/Locations/ViewAll";


function Body({ destinationState }){
    console.log(destinationState.collection);

    switch (destinationState.collection) {
        case "Locations":
            return <LocationViewAll />
    
        default:
            return <div>Nothing Yet</div>
    }
}

export default Body;