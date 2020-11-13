import axios from "axios";

function GetActions() {
    return new Promise(function(resolve, reject){
        console.log("sending GET");
        axios.get("http://localhost:4000/getData").then(data => {
            resolve(data);
        })
    })
}

export default GetActions;

