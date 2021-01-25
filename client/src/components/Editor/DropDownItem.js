import "./css/dropDownStyles.css";

function DropDownItem({ title, onClick }) {
    return (
        <li
            className="dropdown"
            key={title}
        >
            <a
                key={title + "link"}
                href={"#" + title + "Submenu"}
                className="dropdown-toggle"
                data-toggle="dropdown"
                aria-expanded="false"
            >
                {title}
            </a>

            <ul
                className="collapse list-unstyled dropdown-menu animated fadeInLeft"
                key={title + "dropdown-menu"}
                role="menu">
                <div
                    key={title + "dropdownheader"}
                    className="dropdown-header"
                >
                    Choose Action:
                    </div>
                <li>
                    <a
                        href={"#" + title + "-View:All"}
                        key={title + "-View:All"}>
                        View All
                    </a>
                </li>
                <li>
                    <a
                        href={"#" + title + "-Edit:One"}
                        key={title + "-Edit:One"}>
                        Edit One
                    </a>
                </li>
                <li>
                    <a
                        href={"#" + title + "-Create:New"}
                        key={title + "-Create:New"}>
                        Create New
                    </a>
                </li>
            </ul>
        </li>
    )
}

export default DropDownItem;