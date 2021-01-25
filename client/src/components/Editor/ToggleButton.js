function ToggleButton ({ toggleClick }){
    return (
        <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={toggleClick}>
            <i className = "fas fa-align-left"></i>
            <span>Toggle Sidebar</span>
        </button>
    )
}

export default ToggleButton;