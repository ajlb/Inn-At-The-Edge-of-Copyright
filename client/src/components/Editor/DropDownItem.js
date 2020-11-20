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
                <li key={title + "View:All"}>
                    <a 
                    href={"#"+title+"-View:All"}
                    onClick={onClick}
                    >View All</a>
                </li>
                <li key={title + "Edit:All"}>
                    <a 
                    href={"#"+title+"-Edit:All"}
                    onClick={onClick}
                    >Edit All</a>
                </li>
                <li key={title + "Edit:One"}>
                    <a 
                    href={"#"+title+"-Edit:One"}
                    onClick={onClick}
                    >Edit One</a>
                </li>
                <li key={title + "Create:New"}>
                    <a 
                    href={"#"+title+"-Create:New"}
                    onClick={onClick}
                    >Create New</a>
                </li>
                <li key={title + "Delete:One"}>
                    <a 
                    href={"#"+title+"-Delete:One"}
                    onClick={onClick}
                    >Delete One</a>
                </li>
            </ul>
        </li>
    )
}

export default DropDownItem;