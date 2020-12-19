import axios from "axios";

//populate actions from action collection in db
function getCharacters(characterName) {
    return new Promise(function (resolve, reject) {
        characterName = characterName.toLowerCase()
        // console.log("sending GET");
        axios.get("/frontAPI/checkCharacterName/" + characterName).then(data => {
            resolve(data);
        })
    });
}

export {
    getCharacters
};

