import React, { useState, useContext } from 'react';
import { createLocation } from "../../../../Utils/adminAPIs";
import AdminInfo from "../../../../Utils/AdminInfo";

function CreateOneLocation() {


    const adminInfo = useContext(AdminInfo);

    const [locationData, setLocationData] = useState({
        locationName: "",
        dayDescription: "",
        nightDescription: "",
        region: "",
        inventory: [],
        NPCs: "",
        exits: []
    });


    const handleInputChange = event => {
        setLocationData({
            ...locationData,
            [event.target.name]: event.target.value
        });
    }


    const handleCreateSubmit = event => {
        event.preventDefault();
        console.log(locationData);
        createLocation(locationData).then(returnData => {
            console.log(returnData);
        });
        alert("Your new location has been submitted");
    }

    return (
        <div>
            <form
                className="d-flex flex-column editForm"
                style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}
                onSubmit={handleCreateSubmit}
            >

                <div className="row">
                    <label htmlFor="locationName" className="col-2">Name:</label>
                    <input className="col-6" type="text" id="locationName" name="locationName" value={locationData.locationName} onChange={handleInputChange} />
                </div>
                <div className="row">
                    <label htmlFor="dayDescription" className="col-2">Day Description:</label>
                    <textarea rows="8" className="col-6" id="dayDescription" name="dayDescription" value={locationData.dayDescription} onChange={handleInputChange} />
                </div>
                <div className="row">
                    <label htmlFor="nightDescription" className="col-2">Night Description:</label>
                    <textarea rows="8" className="col-6" id="nightDescription" name="nightDescription" value={locationData.nightDescription} onChange={handleInputChange} />
                </div>
                <div className="row">
                    <label htmlFor="region" className="col-2">Region:</label>
                    <input className="col-6" type="text" id="region" name="region" value={locationData.region} onChange={handleInputChange} />
                </div>


                <input type="submit" style={{ width: 90 + "px" }}></input>
            </form>
        </div>
    )
}

export default CreateOneLocation;