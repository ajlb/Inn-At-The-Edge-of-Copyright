import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/dropdown';
import './css/newNav.css';
import DropDownItem from "./DropDownItem";

function Nav({ onSubmenuItemClick, sidebarOpen }) {

    const typesOfCollections = ["Players", "Locations", "Items", "Quests", "Actions", "Races", "Professions", "Weather", "Dialogs"];


    return (
        <nav id="sidebar" className={!sidebarOpen && "active"}>
            <div className="sidebar-header">
                <h3>Inn Staff</h3>
            </div>

            <ul className="list-unstyled components">
                {typesOfCollections.map(collectionName => {
                    return <DropDownItem title={collectionName} onClick={onSubmenuItemClick} key={collectionName} />
                })}
            </ul>
        </nav>
    )
}

export default Nav;