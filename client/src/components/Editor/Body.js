import ToggleButton from "./ToggleButton";
import './css/bodyStyles.css';

function Body ({ toggleClick }){
    return (
        <div id="content">
            <nav className = "navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <ToggleButton toggleClick = {toggleClick}/>
                </div>
            </nav>

            <p>the body</p>
        </div>
    )
}

export default Body;