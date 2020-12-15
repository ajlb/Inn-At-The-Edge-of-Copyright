import React, { useEffect, useState, useContext } from 'react';
import { getLocations } from "../../../../clientUtilities/adminAPIs";
import AdminInfo from "../../../../clientUtilities/AdminInfo";
import "../../css/styles.css";


function LocationViewAll() {

    const [locationData, setLocationData] = useState([])
    const adminInfo = useContext(AdminInfo);


    useEffect(() => {
        getLocations().then(locationData => {
            setLocationData(locationData.data);
            // console.log(locationData.data);
        }
        )
    }, [])

    return (
        <article id="LocBox">
            {locationData.map(location => {
                return (
                    <section
                        key={location.locationName}
                        className={location.region.replace(/\s/g, "-")}
                        style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}>

                        <header><h4><strong>Name: </strong>{location.locationName}</h4></header>

                        <div><strong>Day Description: </strong>{location.dayDescription}</div>

                        <div><strong>Night Description: </strong>{location.nightDescription}</div>

                        <div><strong>Region: </strong>{location.region}</div>

                        <div><strong>Indoor or Outdoor: </strong>{location.indoorOutdoor}</div>

                        <div><strong>Exits: </strong>
                            <ul>
                                {location.exits.map(exit => {
                                    const key = Object.keys(exit)[0];
                                    return (
                                        <li>
                                            {key}: {exit[key]}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div><strong>Inventory: </strong>
                            <ul>
                                {location.inventory.length === 0 && "empty"}
                                {location.inventory.map(item => {
                                    return (
                                        <li>
                                            {item.name} - {item.quantity}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>
                )
            })}
        </article>
    )
}

export default LocationViewAll;