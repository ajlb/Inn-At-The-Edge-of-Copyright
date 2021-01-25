import React from 'react';
import "./css/navStyles.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/dropdown';
import DropDownItem from "./DropDownItem";





function Nav({ onSubmenuItemClick }) {
    //array of collections for creating list of menus
    const typesOfCollections = ["Players", "Locations", "Items", "Quests", "Actions", "Races", "Professions", "Weather", "Dialogs"];



    return (
        <nav className="navbar navbar-inverse fixed-top" id="sidebar-wrapper" role="navigation">
            <ul className="nav sidebar-nav">
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <a href="#admin">Inn Staff</a></div></div>
                {typesOfCollections.map(collectionName => {
                    return <DropDownItem title={collectionName} onClick={onSubmenuItemClick} key={collectionName} />
                })}
                <li key="Game"><a href="#game">The Game</a></li>
            </ul>
        </nav>
    )
}

export default Nav;