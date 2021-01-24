import { useContext, useEffect } from "react";
import AdminInfo from "../../../../clientUtilities/AdminInfo";
import { getAllDialogs } from "../../../../clientUtilities/adminAPIs";

function ViewAll() {

    useEffect(() => {
        getAllDialogs()
            .then(({ data }) => console.log(data))
            .catch(e => console.log(e))
    }, [])

    const adminInfo = useContext(AdminInfo)

    return (
        <main style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }} >
            <h1>View All Dialogs</h1>
        </main>
    )
}

export default ViewAll;