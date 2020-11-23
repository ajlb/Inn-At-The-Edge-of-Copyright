import React, { useState, useEffect, useContext } from 'react';
import { createLocation, getLocations } from "../../../../clientUtilities/adminAPIs";
import AdminInfo from "../../../../clientUtilities/AdminInfo";
let locationNames = [];

function CreateOneLocation() {

    const adminInfo = useContext(AdminInfo);
    const initialAlert = {
        severity: "none",
        message: "none"
    };
    const [alert, setAlert] = useState(initialAlert);

    const initialLocationData = {
        locationName: "",
        dayDescription: "",
        nightDescription: "",
        region: "",
        inventory: [],
        NPCs: "",
        exits: [],
        indoorOutdoor: "",
    };
    const [locationData, setLocationData] = useState(initialLocationData);

    useEffect(() => {
        getLocations().then(locationsData => {
            locationNames = [];
            for (const location of locationsData.data) {
                locationNames.push(location.locationName);
            }
            console.log(locationNames);
        })
    }, [])

    const handleInputChange = event => {
        setLocationData({
            ...locationData,
            [event.target.name]: event.target.value
        });
    }


    const handleCreateSubmit = event => {
        event.preventDefault();
        console.log(locationData);
        console.log(locationNames.indexOf(locationData.locationName) === -1);
        console.log(locationNames);
        if (locationNames.indexOf(locationData.locationName) === -1) {
            createLocation(locationData).then(returnData => {
                console.log(returnData);
                locationNames.push(locationData.locationName)
                setLocationData(initialLocationData);
                setAlert({
                    severity: "green",
                    message: "Your location has been submitted!"
                });
                console.log(alert);
            });
        } else {
            setAlert({
                severity: "red",
                message: "This location name has already been used."
            });
            console.log(alert);

        }
    }

    return (
        <div>
            {!(alert.severity === "none") && <div style={{ textAlign: "center", backgroundColor: alert.severity, marginBottom: 20 + "px" }}>{alert.message}</div>}
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
                <div className="row">
                    <label htmlFor="indoorOutdoor" className="col-2">Indoor or Outdoor:</label>
                    <input className="col-6" type="text" id="indoorOutdoor" name="indoorOutdoor" value={locationData.indoorOutdoor} onChange={handleInputChange} />
                </div>


                <input type="submit" style={{ width: 90 + "px" }}></input>
            </form>
        </div>
    )
}

export default CreateOneLocation;