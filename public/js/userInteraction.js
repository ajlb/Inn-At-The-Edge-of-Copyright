//VARIABLES
const DIRECTIONWORDS = {N:["n", "north"], E:["e", "east"], S:["s", "south"], W:["w", "west"]};
const ARTICLES = ["the", "a", "an"];
let currentLocation; //holds all data for current location
let currentExits; //easily accessible exit data
let currentLocationId; //location ID prefixed with "L"
let currentLocationInventory; //inventory of this location
let isDay = true;
let userRecentCommands = [];
let actionData = {};
let actionCalls = {};
let currentUserId;


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
    updateScroll();
  }
  
  function describeThis(text) {
    $("#anchor").before(`<p class="displayed-description">${text}</p>`);
    updateScroll();
  }

  function findMatchByItemNameAndChangeQuantity(value, data, target, amount){
    return new Promise(function(resolve, reject){
      for (const thing of data){
        //increase quantity if match found
        if (thing.item.itemName.toLowerCase() === value.toLowerCase()){
          changeItemQuantity(thing.itemId, target, amount);
          scrubInventory();
          resolve(true);
        }
        console.log(target);
        if (target.startsWith("P") && (amount > 0)){
          logThis(`You pick up ${amount} ${pluralize(value, amount)}.`)
        } else if (target.startsWith("P") && (amount < 0)){
          console.log("PLAYER DROP");
          logThis(`You drop ${Math.abs(amount)} ${pluralize(value, Math.abs(amount))}.`)
        }
      }
    });
  }





  


  //MID LEVEL FUNCTIONS

  //Scrolling
function updateScroll(){
    $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)  
  }
  
//get user Id from pubnub, then put into string for searching inventories
function setUserInventoryId(){
  thisUser = pubnub.getUUID();
  getPlayerData(thisUser).then(function(data){
    currentUserId = "P" + data.id;
  });
}

//set up action words for parsing user input
function setActionCalls(){
  getActions().then(function(data){
    actionData = data;

    for (const action of data) {
      actionCalls[action.actionName] = action.waysToCall.split(", ");
    }
  });
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
      possibleDirections += exit + ", ";
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
    describeThis(locationData.dayDescription);
  } else {
    describeThis(locationData.nightDescription);
  }
}

//react to input beginning with a move word
function parseMove(value){
  value = takeTheseOffThat(actionCalls.move, value);
  let success = false;
  for (const direction in DIRECTIONWORDS){
    if (DIRECTIONWORDS[direction].includes(value.toLowerCase())){
      success = true;
      newLocation(direction);
    }
  }
  if (!success){
    logThis(`You can't move '${value}'! For help, type 'help move'.`)
    updateScroll();
  }
}

//react to input beginning with inventory
function parseInventory(PlayerLocationItemID){
  return new Promise(function(resolve, reject){
    //Player Inventory
    if (PlayerLocationItemID.toLowerCase() === "player"){
      getInventory(currentUserId).then(function(data){
        let personalInventory = [];
        for (const item of data){
          personalInventory.push(`${item.quantity} ${pluralize(item.item.itemName, item.quantity)}`);
        }
        logThis(`Your inventory: <br> ${personalInventory.join("<br>")}`)
        resolve(personalInventory);
      });
      //Location Inventory
    } else if (PlayerLocationItemID.toLowerCase() === "location"){
      getInventory(currentLocationId).then(function(data){
        let locationInventory = [];
        for (const item of data){
          locationInventory.push(`${item.quantity} ${pluralize(item.item.itemName, item.quantity)}`);
        }
        currentLocationInventory = locationInventory;
        describeThis(`You see: ${currentLocationInventory.join(", ")}`);
        resolve(currentLocationInventory);
      });
      //Item Inventory
    } else if (PlayerLocationItemID.startsWith("I")) {
      getInventory(PlayerLocationItemID).then(function(data){
        //Check this once there's an item with inventory
        let itemInventory = [];
        for (const item of data){
          itemInventory.push(`${item.quantity} ${pluralize(item.item.itemName, item.quantity)}`)
        }
        resolve(itemInventory);
      });
    }    
  });
}

//react to input beginning with get command
function getItem(value){
  value = takeTheseOffThat(actionCalls.get, value);
  value = takeTheseOffThat(ARTICLES, value);
  //check if item is in location
  getInventory(currentLocationId).then(function(data){
   findMatchByItemNameAndChangeQuantity(value, data, currentLocationId, -1).then(function(roomResult){
     if (roomResult){
       //get user inventory to check for item in inv
       getInventory(currentUserId).then(function(userInvData){
         findMatchByItemNameAndChangeQuantity(value, userInvData, currentUserId, 1).then(function(result){
           if (!(result)){
             addItemToInventory(value, currentUserId, 1);
             console.log("added item");
             return "added item to Inventory"
           }//if findMatch... returned true for user
         });//end findMatch... for user
       });//end getInventory() of user
     }//if findMatch... returned true for room
     else { //this runs is there's no matching item in room
       logThis(`There's no ${value} here!`)
     }
   })//end findMatch... for room
  });//getInventory() for room
}

function dropItem(value){
  value = takeTheseOffThat(actionCalls.drop, value);
  value = takeTheseOffThat(ARTICLES, value);
  
  //check if user has it
  getInventory(currentUserId).then(function(userInventory){
    findMatchByItemNameAndChangeQuantity(value, userInventory, currentUserId, -1).then(function(userHas){
      if (userHas){
        getInventory(currentLocationId).then(function(locationInventory){
          findMatchByItemNameAndChangeQuantity(value, locationInventory, currentLocationId, 1).then(function(locationHad){
            if (!(locationHad)){
              addItemToInventory(value, currentLocationId, 1);
            }
          });
        });
      } else { //user didn't have item
        logThis(`You don't have any ${pluralize(value, 4)} to drop!`);
      }
    });
  });
}

//reach to input beginning with look command
function lookAround(value){
  logThis(`You look around.`)
  printLocationDescription(currentLocation);
  printExits(currentExits);
  parseInventory("Location");
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
        currentLocationId = "L" + currentLocation.id;
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

  if (doesThisStartWithThose(value, actionCalls.move)) {
    parseMove(value);
  } else if (doesThisStartWithThose(value, actionCalls.inventory)){
    parseInventory("Player");
  } else if (doesThisStartWithThose(value, actionCalls.get)){
    getItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.look)){
    lookAround(value);
  } else if (doesThisStartWithThose(value, actionCalls.drop)){
    dropItem(value);
  }
});



























  //INITIALIZE PAGE
  newLocation("start");
  setActionCalls();
  setUserInventoryId();