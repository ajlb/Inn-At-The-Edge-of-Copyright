import React, { useEffect, useState } from 'react';
import "./css/navStyles.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/dropdown';




let isClosed = false;

function Nav() {

    const [navState, setNavState] = useState("open");
    const [dropDownState, setDropDownState] = useState({
        players: false,
        locations: false,
        items: false,
        professions: false,
        races: false,
        quests: false,
        actions: false,
        weather: false
    })

    function hamburgerCross() {

        if (isClosed === true) {
            isClosed = false;
            setNavState("open");
        } else {
            isClosed = true;
            setNavState("closed");
        }
    }

    function dropSomething(event) {
        const destination = event.target.getAttribute("href");
        switch (destination) {
            case "#players":
                console.log("This is players");
                break;
            case "#locations":
                console.log("This is locations");
                break;
            case "#items":
                console.log("This is items");
                break;
            case "#quests":
                console.log("This is quests");
                break;
            case "#actions":
                console.log("This is actions");
                setDropDownState({
                    ...dropDownState,
                    actions: true
                });
                break;
            case "#races":
                console.log("This is races");
                break;
            case "#professions":
                console.log("This is professions");
                break;
            case "#game":
                console.log("This is going back to the game");
                break;
            default:
                console.log("Not sure");
                break;
        }
    }





    return (
        <div
            id="wrapper"
            className={navState === "closed" ? "" : "toggled"}
        >
            <div
                className={navState === "closed" ? "overlay visible" : "overlay invisible"}></div>


            <nav className="navbar navbar-inverse fixed-top" id="sidebar-wrapper" role="navigation">
                <ul className="nav sidebar-nav" onClick={dropSomething}>
                    <div className="sidebar-header">
                        <div className="sidebar-brand">
                            <a href="#admin">Inn Staff</a></div></div>
                    <li><a href="#players">Players</a></li>
                    <li><a href="#locations">Locations</a></li>
                    <li><a href="#items">Items</a></li>
                    <li><a href="#quests">Quests</a></li>
                    <li className="dropdown">
                        <a href="#actions" className="dropdown-toggle" data-toggle="dropdown">Actions <span className="caret"></span></a>
                        <ul className="dropdown-menu animated fadeInLeft" role="menu">
                            <div className="dropdown-header">Dropdown heading</div>
                            <li><a href="#pictures">Pictures</a></li>
                            <li><a href="#videos">Videeos</a></li>
                            <li><a href="#books">Books</a></li>
                            <li><a href="#art">Art</a></li>
                            <li><a href="#awards">Awards</a></li>
                        </ul>
                    </li>
                    <li><a href="#professions">Professions</a></li>
                    <li><a href="#races">Races</a></li>
                    <li><a href="#game">The Game</a></li>
                </ul>
            </nav>



            <div id="page-content-wrapper">
                <button
                    type="button"
                    className={navState === "closed" ? "hamburger animated fadeInLeft is-closed" : "hamburger animated fadeInLeft is-open"}
                    data-toggle="offcanvas"
                    onClick={hamburgerCross}
                >
                    <span className="hamb-top"></span>
                    <span className="hamb-middle"></span>
                    <span className="hamb-bottom"></span>
                </button>
                <div className="container">
                    <div className="row">
                        <form>
                            <label htmlFor="something">Something: </label>
                            <input name="something" id="something" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav;