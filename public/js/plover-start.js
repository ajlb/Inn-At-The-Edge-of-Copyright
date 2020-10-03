//GOALS:
  //allow user to stay scrolled up if they scroll, but pin to the bottom again if they scroll down.
  //set up user accounts
  //create characters
  //accept examine object or examine person
  //accept attack. other combat commands? Guard? retreat? spells?
  //accept bandage/tend
  //accept give, trade
  //should there be a directions (dir <place> gives you directions to there)?
  //eat? drink?
  //accept Use
  //OOC?
  //accept Buy/Sell
  //accept wear/take off


const pubnub = new PubNub({
  publishKey: 'pub-c-3b1a90da-b8c6-4753-a965-7fd056636e55',
  subscribeKey: 'sub-c-9fd7a810-f093-11ea-92d8-06a89e77181a',
  uuid: "Rellwoos"
});

let channel;
let locationIndex = "North-Woods-Entrance";
const shortDirections = {n:"north", s:"south", e:"east", w:"west"};
//Game data is accessed with the variable woodsWalk












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
function startStartWith(thing, stringy) {
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

function compileExits(locationName){
  let exits = "Exits: ";
  for (let exitIndex in woodsWalk.location[locationName].exits) {
    if (!(woodsWalk.location[locationName].exits[exitIndex] === "none") && !(woodsWalk.location[locationName].exits[exitIndex]===undefined)) {
      exits += `${exitIndex}, `;
    }
  }
  return exits;
}






//MID-LEVEL FUNCTIONS

//write the messages out to the chat box
displayMessage = function(messageType, aMessage) {
  console.log(aMessage);
  $("#anchor").before(`<p class="displayed-message">${aMessage.publisher}: ${aMessage.message.text}</p>`);
  updateScroll();
}

//publish text to pubnub server as a message
function publishMessage(value){
  pubnub.publish({
    channel: channel,
    message: {"text":value},
    },

    function(status, response) {
      console.log("Publishing from submit button event");
      if (status.error) {
        console.log(status);
        console.log(response);
      }
    }
  );
}

//Srolling
function updateScroll(){
  $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)  
}














//ACTION FUNCTIONS

function actionGetObject(inputValue) {
  //remove extraneous text
  inputValue = takeTheseOffThat(interactionWords.get, inputValue);
  inputValue = takeTheseOffThat(["a ", "the "], inputValue);
  console.log("Getting a " + inputValue);
  //check if item is here
  let objectIndex = woodsWalk.location[locationIndex].items.findIndex(item => item.name === inputValue);
  if ((objectIndex > -1) && woodsWalk.location[locationIndex].items[objectIndex].status === "here"){
    logThis(`You pick up the ${inputValue}.`)
    //add item to inventory, remove from room
    woodsWalk.character.inventory.push(woodsWalk.location[locationIndex].items[objectIndex]);
    woodsWalk.location[locationIndex].items[objectIndex].status = "gone";
    //send message if no matching object
  } else {
    inputValue = takeTheseOffThat(interactionWords.get, inputValue);
    inputValue = takeTheseOffThat(["a ", "the "], inputValue);
    logThis(`There doesn't seem to be a ${inputValue} around here.`);
  }
  updateScroll();
}


function actionDropObject(inputValue) {

  //remove extraneous text
  inputValue = takeTheseOffThat(interactionWords.drop, inputValue);
  inputValue = takeTheseOffThat(["a ", "the "], inputValue);

  console.log("Dropping a " + inputValue);

  //find first instance of object in inventory
  let objectIndex = woodsWalk.character.inventory.findIndex(item => item.name === inputValue);
  if (!(objectIndex === -1)) {
    //remove object from inventory by index
    let droppedObject = woodsWalk.character.inventory[objectIndex]; 
    let newInventory = woodsWalk.character.inventory.slice(0, objectIndex).concat(woodsWalk.character.inventory.slice(objectIndex+1, woodsWalk.character.inventory.length));
    woodsWalk.character.inventory = newInventory;
    logThis(`You drop the ${inputValue}.`);

    //add object to room, or if already in list with status gone, change status to here
    let roomIndex = woodsWalk.location[locationIndex].items.findIndex(item => (item.name === inputValue && item.status === "gone"));
      if (roomIndex > -1) {
        woodsWalk.location[locationIndex].items[roomIndex].status = "here";
      } else {
        droppedObject.status = "here";
        woodsWalk.location[locationIndex].items.push(droppedObject);
        
      }
  } else {
    logThis(`You don't seem to have a ${inputValue} to get rid of.`);
  }

  updateScroll();
}


function actionSpeak(inputValue) {
      let startsWithQuotes = false;
    if (inputValue.toLowerCase().startsWith("say ")) {
      inputValue = inputValue.slice(4);
    }
    if (inputValue.startsWith("\"") || inputValue.startsWith("\'")) {
      inputValue = inputValue.slice(1);
      startsWithQuotes = true;
    }
    if ((inputValue.endsWith("\"") || inputValue.endsWith("\'")) && (startsWithQuotes)) {
      inputValue = inputValue.slice(0,-1);
      startsWithQuotes = false;
    }
    publishMessage(inputValue);
}


function actionCheckInventory() {
  if (woodsWalk.character.inventory.length > 0) {
    let tempInventory = woodsWalk.character.inventory.map(elem => elem.name).join(", ");
    logThis(`Your inventory: ${tempInventory}`);
  } else {
    logThis("You have nothing in your inventory.")
  }
  updateScroll();
}


function actionLookAround() {
      //display room location and description
      $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">You look around you.</p>`);
      describeThis(woodsWalk.location[locationIndex].descriptions["light"])
      let availableExits = compileExits(locationIndex);
      describeThis(availableExits);
      
      //add interactable items
      if (woodsWalk.location[locationIndex].items.length > 0){
        let objectString = "";
        for (let item of woodsWalk.location[locationIndex].items){
          if (item.status === "here") {
            objectString += "a " + item.name + ", ";
          }
        }
        if (objectString.length > 0) {
          objectString = objectString.slice(0,-2);
          objectString += ".";
          describeThis(`You also see: ${objectString}`)
        } else {
          describeThis("Nothing else seems to be here.")
        }
      }
      updateScroll();
}


function actionMove(direction){
  if (doesThisEqualThat(direction, movementWords.directions)){
    direction = parseAlternateWords(direction, directions)
    Chatroom(direction.toLowerCase());
  } else {
    direction = takeTheseOffThat(movementWords.move, direction);
    direction = parseAlternateWords(direction, directions);
    Chatroom(direction.toLowerCase());
  }
  updateScroll();
}


function askForHelp() {
  let commandList = "Accepted commands:<br><br>";
  for (let command in commands) {
    let nextline = `${command}: ${commands[command].result}<br> use: `;
      for (let subItem of commands[command].input) {
        nextline += subItem + ", ";
      }
    nextline = nextline.slice(0, -2) + "<br><br>"
    commandList += nextline;
  }
  logThis(commandList);
  updateScroll();
}


function actionDescribeAction(inputValue) {
  inputValue = takeTheseOffThat(["/me"], inputValue);
  if (inputValue.length > 0) {
    logThis(`${pubnub.getUUID()} ${inputValue}`);
  } else {
    logThis("You need to type something to do if you want to use /me!")
  }
  updateScroll();
}















//add a listener to the pubnub object to receive incoming messages etc.
pubnub.addListener({
  message: (message) => {
    displayMessage('[MESSAGE: received]', message);

    const channelName = message.channel;
    const channelGroup = message.subscription;
    const publishTimetoken = message.timetoken;
    const msg = message.message;
    const publisher = message.publisher;
    const unixTimestamp = message.timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
  },

  status: (status) => {
    const affectedChannels = status.affectedChannels;
    const category = status.category;
    const operation = status.operation;
  },

  presence: (presence) => {
    const action = presence.action;
    const channelName = presence.channel;
    const uuid = presence.uuid;
  },
});//end addListener





//MOVE TO A NEW ROOM, AND GET A NEW CHAT
const Chatroom = function(direction) {

  // give this chatroom the correct id
  if (direction === "start") {
    locationIndex = "North-Woods-Entrance";
    $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">In: ${locationIndex.replace(/ /g, " ")}</p>`);
    $("#anchor").before(`<p class="displayed-description">${woodsWalk.location[locationIndex].descriptions["light"]}</p>`);
    let availableExits = compileExits(locationIndex);
    describeThis(availableExits);
    updateScroll();
  } else if (!(woodsWalk.location[locationIndex].exits[direction] === "none") && !(woodsWalk.location[locationIndex].exits[direction] === undefined)) {
    //unsubscribe from previous room
    //set locationIndex to next location
    locationIndex = woodsWalk.location[locationIndex].exits[direction];
    $("#anchor").before(`<p class="displayed-message">You moved ${shortDirections[direction]}</p>`);
    $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">In: ${locationIndex.replace(/ /g, " ")}</p>`);
    describeThis(woodsWalk.location[locationIndex].descriptions["light"]);
    let availableExits = compileExits(locationIndex);
    describeThis(availableExits);
    updateScroll();

  } else {
    logThis("There's no exit at " + direction);
  }

  // set channel off of locationIndex channel
  const id = locationIndex;
  channel = 'oo-chat-' + id;
  $(".panel-heading").text(`${id}`);

  // this function is fired when Chatroom() is called
  const init = function() {

    pubnub.unsubscribeAll();
    console.log("subscribing");
    pubnub.subscribe({channels: [channel]});

  };//end init

  init();

};

//INITIALIZE PAGE
Chatroom("start");



















//INPUT SUBMIT BEHAVIOR
$("#submit-button").click(function(event) {
  event.preventDefault();

  //log, then clear input value
  let value = $(".chat-input").val();
  console.log(value);
  $(".chat-input").val("");

  //ACCEPT: look (look or l)
  if (startStartWith("l", value) || startStartWith("look", value)){
    actionLookAround();

    //ACCEPT: speaking cues
  } else if (value.startsWith("\"") || value.startsWith("\'") || value.toLowerCase().startsWith("say ")){
    actionSpeak(value);

    //ACCEPT picking up items - Inventory +, Room -
  } else if (doesThisStartWithThose(value, interactionWords.get)) {
    actionGetObject(value);

    //ACCEPT droping object - Inventory -, Room +
  } else if (doesThisStartWithThose(value, interactionWords.drop)) {
    actionDropObject(value);

    //ACCEPT: looking at inventory
  } else if (startStartWith("i", value) || startStartWith("inventory", value)) {
    actionCheckInventory();

    //ACCEPT: cardinal directions for movement
  } else if (doesThisEqualThat(value, movementWords.directions) || doesThisStartWithThose(value, movementWords.move)) {
    actionMove(value);

    //ACCEPT: help - display commands
  } else if (startStartWith("help", value)) {
    askForHelp();
  
    //ACCEPT: /me to describe actions
  } else if (value.toLowerCase().startsWith("/me")) {
    actionDescribeAction(value);
  
    //UNACCEPTED COMMANDS
  } else {
    logThis(value + " is not a recognized command! type 'help' for a list of accepted commands");
    updateScroll();
  }


})

