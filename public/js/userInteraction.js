//VARIABLES
let currentLocation;
let currentExits;
let isDay = true;
let userRecentCommands = [];



//HELPER FUNCTIONS

//determine if a string begins with any of an array of other strings
function doesThisStartWithThose(thisThing, those) {
    for (let thing of those) {
      if (thisThing.toLowerCase().startsWith(thing)) {
        return true
      }
    }
    return false
  }
  
  //single value startWith() that tests for space or equal value
  function startsWithOrIs(thing, stringy) {
    if (stringy.toLowerCase().startsWith(`${thing} `) || ((stringy.toLowerCase().startsWith(thing)) && (stringy.length === thing.length))){
      return true
    }
    return false
  }
  
  //slice off any string from an array that is found at the beginning of another string
  function takeTheseOffThat(these, that) {
    for (let thing of these) {
      if (that.toLowerCase().startsWith(thing)) {
        return that.slice(thing.length).trim();
      }
    }
  
    return that;
  }
  
  //see if a string is equal to any of the strings in an array
  function doesThisEqualThat(thisThing, that) {
    for (let thing of that) {
      if (thisThing.toLowerCase().trim() === thing) {
        return true;
      }
    }
    return false;
  }
  
  //return alias for words with multiple ways to type them
  function parseAlternateWords(thisThing, objecty) {
    for (let thing in objecty) {
      if (thisThing.toLowerCase().trim() === objecty[thing]) {
        return thing;
      }
    }
    return thisThing;
  }
  
  function logThis(text) {
    $("#anchor").before(`<p class="displayed-message">${text}</p>`);
  }
  
  function describeThis(text) {
    $("#anchor").before(`<p class="displayed-description">${text}</p>`);
  }


  //MID LEVEL FUNCTIONS

  //Scrolling
function updateScroll(){
    $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)  
  }
  
//find and compile exits
function compileExits(locationData){
  let possibleExits = {};
  for (const prop in locationData){
    if (prop.startsWith("exit")) {
      possibleExits[prop.replace("exit", "")] = locationData[prop];
    }
  }
  return possibleExits
}

//show exits
function printExits(exitObject){
  let possibleDirections = "";
  for (const exit in exitObject){
    if (!(exitObject[exit] == null)) {
      console.log(exit);
      possibleDirections += exit + ", ";
    } else {
      console.log("not" + exit);
    }
  }
  if (possibleDirections.length > 0){
    describeThis(`Exits: ${possibleDirections}`);
  } else {
    describeThis("No visible exits.")
  }
}

//show room description
function printLocationDescription(locationData){
  if (isDay){
    describeThis(locationData.locationDayDescription);
  } else {
    describeThis(locationData.locationNightDescription);
  }
}





//HIGH LEVEL FUNCTIONS


//MOVE TO A NEW ROOM, AND GET A NEW CHAT
const newLocation = function(direction) {
  let locationIndex;
    // give this chatroom the correct id
    if (direction === "start") {
      //set currentLocation, and pass to pubnub as locationIndex
      getLocation(1).then(function(data){
        currentLocation = data;
        locationIndex = data.locationName.replace(/ /g, "-");
        $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">${currentLocation.locationName}</p>`);

        printLocationDescription(currentLocation);
        currentExits = compileExits(currentLocation);
        printExits(currentExits);

        updateScroll();
      });
      
    } else if (!(currentExits[direction] == null)) {
      //set currentLocation, and pass to pubnub as locationIndex
      getLocation(currentExits[direction]).then(function(data){
        currentLocation = data;
        currentExits = compileExits(currentLocation);
        locationIndex = data.locationName.replace(/ /g, "-");

        $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">${currentLocation.locationName}</p>`);

        printLocationDescription(currentLocation);
        printExits(currentExits);

        updateScroll();
      })
  
    } else {
      logThis("There's no exit at " + direction);
    }
  
    // set channel off of locationIndex channel
    const id = locationIndex;
    channel = 'oo-chat-' + id;
    console.log("In Room ID: " + id);
  
    // this function is fired when Chatroom() is called
    //it unsubscribes from previous rooms, and subscribes to the new room
    const init = function() {
  
      pubnub.unsubscribeAll();
      console.log("subscribing");
      pubnub.subscribe({channels: [channel]});
  
    };//end init
  
    init();
  
  };


  //RESPOND TO USER INPUT
$("#submit-button").click(function(event) {
  event.preventDefault();

  //log, then clear input value
  let value = $(".chat-input").val();
  console.log(value);
  $(".chat-input").val("");
  userRecentCommands.push(value);

  if (value.startsWith("move ")){
    newLocation(value.split(" ")[1]);
  }
});



























  //INITIALIZE PAGE
  newLocation("start");