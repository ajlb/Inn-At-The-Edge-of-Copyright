import React, { useEffect, useState } from 'react';
import { editLocation, getOneLocation, getLocations } from "../../../../Utils/adminAPIs";

function EditOneLocation() {

    let selection;

    const [allLocations, setAllLocations] = useState([]);
    const [location, setLocation] = useState("");
    const [locationData, setLocationData] = useState({});
    useEffect(() => {
        getLocations().then(locationsData => {
            setAllLocations(locationsData.data);
            console.log("GETTING");
            console.log(locationsData.data);
        })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        setLocation(selection.value.replace(/-/g, " "));
        getOneLocation(selection.value.replace(/-/g, " ")).then(locationData => {
            setLocationData(locationData.data);
        })
    }

    const handleInputChange = event => {
        setLocationData({
            ...locationData,
            [event.target.name]: event.target.value
        });
    }

    switch (location) {
        case "":
            return (
                <form
                    action="/action_page.php"
                    onSubmit={handleSubmit}
                >
                    <label for="action">Choose a location: </label>
                    <select id="locations" name="locations" ref={el => selection = el}>
                        {allLocations.map(oneloc => {
                            return <option value={oneloc.locationName.replace(/\s/g, "-")}>{oneloc.locationName}</option>
                        })}


                    </select>
                    <input type="submit" />
                </form>
            )

        default:
            return (
                <form className="d-flex flex-column editForm">
                    
                    <div>
                    <label htmlFor="locationName">Name:</label>
                    <input type="text" id="locationName" name="locationName" value={locationData.locationName} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label htmlFor="dayDescription">Day Description:</label>
                    <textarea id="dayDescription" name="dayDescription" value={locationData.dayDescription} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label htmlFor="nightDescription">Night Description:</label>
                    <textarea id="nightDescription" name="nightDescription" value={locationData.nightDescription} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label htmlFor="region">Region:</label>
                    <input type="text" id="region" name="region" value={locationData.region} onChange={handleInputChange}/>
                    </div>
                </form>
            )
    }
}

export default EditOneLocation;