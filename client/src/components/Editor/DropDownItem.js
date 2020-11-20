import React from 'react';


function DropDownItem({ title, onClick }) {
    return (
        <li className="dropdown" key={title}>
            <a
                key={title + "link"}
                
                href={"#" + title.toLowerCase()}
                className="dropdown-toggle"
                data-toggle="dropdown"
            >
                {title}<span className="caret"></span>
            </a>
            <ul
                className="dropdown-menu animated fadeInLeft"
                key={title + "dropdown-menu"}
                role="menu"
            >
                <div
                    key={title + "dropdownheader"}
                    className="dropdown-header"
                >
                    Choose Action:
                    </div>
                <li key={title + "ViewAll"}>
                    <a 
                    href={"#"+title+"-viewAll"}
                    onClick={onClick}
                    >View All</a>
                </li>
                <li key={title + "EditAll"}>
                    <a 
                    href={"#"+title+"-EditAll"}
                    onClick={onClick}
                    >Edit All</a>
                </li>
                <li key={title + "EditOne"}>
                    <a 
                    href={"#"+title+"-EditOne"}
                    onClick={onClick}
                    >Edit One</a>
                </li>
                <li key={title + "CreateNew"}>
                    <a 
                    href={"#"+title+"-CreateNew"}
                    onClick={onClick}
                    >Create New</a>
                </li>
                <li key={title + "DeleteOne"}>
                    <a 
                    href={"#"+title+"-DeleteOne"}
                    onClick={onClick}
                    >Delete One</a>
                </li>
            </ul>
        </li>
    )
}

export default DropDownItem;