let Calls = new Map();
let callFunctionMap = new Map();

//////////////////
//  START ROOM  //
//////////////////
Calls.set("Start Room", ["open wardobe door", "close wardrobe", "close wardrobe door", "open wardrobe", "open door", "close door", "unlock door", "unlatch door", "look in mirror", "look into mirror", "peer into mirror"]);

callFunctionMap.set("Start Room", {
    "closeWardrobe()": ["open wardobe door", "open wardrobe", "close wardrobe door", "close wardrobe"],
    "adjustDoor()": ["close door", "open door", "unlock door", "unlatch door"],
    "lookInMirror()": ["look in mirror", "look into mirror", "peer into mirror"],
})




function findFunction(input, callFunctionMap){
    return null
}


export default Calls

export {
    callFunctionMap
}