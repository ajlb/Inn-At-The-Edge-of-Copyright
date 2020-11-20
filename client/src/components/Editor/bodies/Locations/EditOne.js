import React, { useEffect, useState, useContext } from 'react';
import { editLocation, getOneLocation, getLocations } from "../../../../Utils/adminAPIs";
import AdminInfo from "../../../../Utils/AdminInfo";

function EditOneLocation() {

    let selection;

    const adminInfo = useContext(AdminInfo);

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



    const handleChooseSubmit = (event) => {
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

    function onBackButtonClick() {
        console.log("back!");
        setLocation("");
    }

    const handleEditSubmit = event => {
        event.preventDefault();
        console.log(locationData);
        editLocation("set", locationData.locationName, locationData).then(returnData => {
            console.log(returnData);
        });
        alert("Your changes have been submitted");
    }

    const itemList = () => {
        if (!locationData.inventory){
            return <div>No items</div>
        } else {
            return (
                <div>Items:
                <ul>
                    {locationData.inventory.map(item => {
                        return (
                        <li>{item.name} <input type="number" name="quantity" id="quantity" defaultValue={item.quantity}/></li>
                        )
                    })}
                </ul>
                </div>
            )
        }
    }

    switch (location) {
        case "":
            return (
                <form
                    action="/action_page.php"
                    onSubmit={handleChooseSubmit}
                    style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}
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
                <div>
                    <button 
                    id="backTo"
                    style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}
                    onClick={onBackButtonClick}>
                        Back
                    </button>
                    <form
                        className="d-flex flex-column editForm"
                        style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}
                        onSubmit={handleEditSubmit}
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

                        {itemList()}


                        <input type="submit" style={{ width: 90 + "px" }}></input>
                    </form>
                </div>
            )
    }
}

export default EditOneLocation;