import React, { useState } from 'react';
import "./css/styles.css";
import Nav from "./Nav";
import "./css/navStyles.css";
import Body from "./Body";
let isClosed = false;

function Editor() {

    const [navState, setNavState] = useState("open");
    const [destinationState, setDestinationState] = useState({
        collection: "",
        action: ""
    });



    function hamburgerCross() {
        //set navbar state to open or closed
        if (isClosed === true) {
            isClosed = false;
            setNavState("open");
        } else {
            isClosed = true;
            setNavState("closed");
        }
    }

    function onSubmenuItemClick(event) {
        //get collection and action out of target a href
        let targetData = event.target.getAttribute("href").slice(1).split("-");
        const collection = targetData[0];
        const action = targetData[1];
        console.log(collection, action);
        //set destination for what to show in body
        setDestinationState({
            collection,
            action
        })
    }



    return (
        <div
            id="wrapper"
            className={navState === "closed" ? "" : "toggled"}
        >

            <header className="jumbotron">
                <h1>{destinationState.collection === "" ? "Admin" : destinationState.collection + " - " + destinationState.action.replace(":", " ")}</h1>
            </header>
            <div
                className={navState === "closed" ? "overlay visible" : "overlay invisible"}></div>

            <Nav
                onSubmenuItemClick={onSubmenuItemClick}
            />
            <section id="page-content-wrapper">
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
                <Body
                    destinationState={destinationState} />
            </section>
        </div>
    )
}

export default Editor;