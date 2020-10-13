//VARIABLES
const DIRECTIONWORDS = { N: ["n", "north"], E: ["e", "east"], S: ["s", "south"], W: ["w", "west"] };
const ARTICLES = ["the", "a", "an"];
const MULTIPLES = ["set", "pair", "box", "bag"];
const VOWELS = ["a", "e", "i", "o", "u"];
let currentLocation; //holds all data for current location
let currentExits; //easily accessible exit data
let currentLocationId; //location ID prefixed with "L"
let currentLocationInventory; //inventory of this location
let isDay = true;
let userRecentCommands = [];
let actionData = {};
let actionCalls = {};
let currentUserData;
let currentUserId;



//HELPER FUNCTIONS

//determine if a string begins with any of an array of other strings
function doesThisStartWithThose(thisThing, those) {
  for (let thing of those) {
    if (thisThing.toLowerCase().startsWith(thing) && (thing.length > 1)) {
      return true
    } else if (thisThing.split(" ")[0].toLowerCase() === thing.toLowerCase()) {
      return true
    }
  }
  return false
}

//single value startWith() that tests for space or equal value
function startsWithOrIs(thing, stringy) {
  if (stringy.toLowerCase().startsWith(`${thing} `) || ((stringy.toLowerCase().startsWith(thing)) && (stringy.length === thing.length))) {
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


function findItemProperty(data) {
  return new Promise(function (resolve, reject) {
    for (const property in data) {
      if (property.endsWith("Slot") && (data[property] === true)) {
        resolve(property);
      }
    }
  });
}

function findMatchByItemName(value, data){
  return new Promise(function(resolve, reject){
  for (const item of data){
    if (item.item.itemName.toLowerCase() === value.toLowerCase()){
      resolve(item);
    }
  }
  resolve(false);
  });
}

function findMatchByItemIdInObject(itemId, data) {
  return new Promise(function (resolve, reject) {
    for (const slot in data) {
      if (data[slot] === itemId) {
        resolve(itemId);
      }
    }
    resolve(false);
  });
}

function findMatchByItemNameAndChangeQuantity(value, data, target, amount) {
  return new Promise(function (resolve, reject) {
    let wasItIn;
    if (target.startsWith("P") && (amount > 0)) {
      logThis(`You pick up ${insertArticleSingleValue(value)}.`)
    } else if (target.startsWith("L") && (amount > 0)) {
      logThis(`You drop ${insertArticleSingleValue(value)}.`)
    }
    for (const thing of data) {
      //increase quantity if match found
      if (thing.item.itemName.toLowerCase() === value.toLowerCase()) {
        changeItemQuantity(thing.itemId, target, amount);
        scrubInventory();
        wasItIn = true;
        resolve(true);
      }
    }
    resolve(false);
  });
}

//Scrolling
function updateScroll() {
  $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)
}


//only pluralize things that don't start with multiples words
function pluralizeAppropriateWords(itemName, itemQuantity) {
  if (doesThisStartWithThose(itemName, MULTIPLES)) {
    return itemName;
  } else {
    return pluralize(itemName, itemQuantity);
  }
}


function insertArticleSingleValue(value) {
  if (doesThisStartWithThose(value, VOWELS)) {
    return `an ${value}`;
  } else {
    return `a ${value}`;
  }
}

//MID LEVEL FUNCTIONS





//get user Id from pubnub, then put into string for searching inventories
function setUserInventoryId() {
  return new Promise(function(resolve, reject){
    getPlayerData(thisUser).then(function (data) {
      thisUser = pubnub.getUUID();
      currentUserData = data;
      currentUserId = "P" + data.id;
      resolve(currentUserData);
  })
  });
}

//set up action words for parsing user input
function setActionCalls() {
  getActions().then(function (data) {
    actionData = data;

    for (const action of data) {
      actionCalls[action.actionName] = action.waysToCall.split(", ");
    }
  });
}

//find and compile exits
function compileExits(locationData) {
  let possibleExits = {};
  for (const prop in locationData) {
    if (prop.startsWith("exit")) {
      possibleExits[prop.replace("exit", "")] = locationData[prop];
    }
  }
  return possibleExits
}

//show exits
function printExits(exitObject) {
  let possibleDirections = "";
  for (const exit in exitObject) {
    if (!(exitObject[exit] == null)) {
      possibleDirections += exit + ", ";
    }
  }
  if (possibleDirections.length > 0) {
    describeThis(`Exits: ${possibleDirections}`);
  } else {
    describeThis("No visible exits.")
  }
}

//show room description
function printLocationDescription(locationData) {
  if (isDay) {
    describeThis(locationData.dayDescription);
  } else {
    describeThis(locationData.nightDescription);
  }
}

//react to input beginning with a move word
function parseMove(value) {
  value = takeTheseOffThat(actionCalls.move, value);
  let success = false;
  for (const direction in DIRECTIONWORDS) {
    if (DIRECTIONWORDS[direction].includes(value.toLowerCase())) {
      success = true;
      newLocation(direction);
    }
  }
  if (!success) {
    logThis(`You can't move '${value}'! For help, type 'help move'.`)
    updateScroll();
  }
}

//react to input beginning with inventory
function parseInventory(PlayerLocationItemID) {
  return new Promise(function (resolve, reject) {
    scrubInventory();
    //Player Inventory
    if (PlayerLocationItemID.toLowerCase() === "player") {
      getInventory(currentUserId).then(function (data) {
        let personalInventory = [];
        for (const item of data) {
          //check if item is in a set, and if not, pluralize
          personalInventory.push(`${item.quantity} ${pluralizeAppropriateWords(item.item.itemName, item.quantity)}`);
        }
        logThis(`Your inventory: <br> ${personalInventory.join("<br>")}`)
        resolve(personalInventory);
      });
      //Location Inventory
    } else if (PlayerLocationItemID.toLowerCase() === "location") {
      getInventory(currentLocationId).then(function (data) {
        let locationInventory = [];
        for (const item of data) {
          //check if item is in a set, and if not, pluralize
          locationInventory.push(`${item.quantity} ${pluralizeAppropriateWords(item.item.itemName, item.quantity)}`);
        }
        currentLocationInventory = locationInventory;
        describeThis(`You see: ${currentLocationInventory.join(", ")}`);
        resolve(currentLocationInventory);
      });
      //Item Inventory
    } else if (PlayerLocationItemID.startsWith("I")) {
      getInventory(PlayerLocationItemID).then(function (data) {
        //Check this once there's an item with inventory
        let itemInventory = [];
        for (const item of data) {
          //check if item is in a set, and if not, pluralize
          itemInventory.push(`${item.quantity} ${pluralizeAppropriateWords(item.item.itemName, item.quantity)}`)
        }
        resolve(itemInventory);
      });
    }
  });
}

//react to input beginning with get command
function getItem(value) {
  value = takeTheseOffThat(actionCalls.get, value);
  value = takeTheseOffThat(ARTICLES, value);
  let itemId;
  findItemData(value).then(data => itemId = data.id);
  //check if item is in location
  getInventory(currentLocationId).then(function (data) {
    findMatchByItemNameAndChangeQuantity(value, data, currentLocationId, -1).then(function (roomResult) {
      if (roomResult) {
        //get user inventory to check for item in inv
        getInventory(currentUserId).then(function (userInvData) {
          findMatchByItemNameAndChangeQuantity(value, userInvData, currentUserId, 1).then(function (result) {
            if (!result) {
              addItemToInventory(itemId, currentUserId, 1);
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

function dropItem(value) {
  value = takeTheseOffThat(actionCalls.drop, value);
  value = takeTheseOffThat(ARTICLES, value);
  let itemId;
  findItemData(value).then(data => itemId = data.id);
  //check if user has it
  getInventory(currentUserId).then(function (userInventory) {
    findMatchByItemNameAndChangeQuantity(value, userInventory, currentUserId, -1).then(function (userHas) {
      if (userHas) {
        getInventory(currentLocationId).then(function (locationInventory) {
          findMatchByItemNameAndChangeQuantity(value, locationInventory, currentLocationId, 1).then(function (locationHad) {
            if (!(locationHad)) {
              addItemToInventory(itemId, currentLocationId, 1);
            }
          });
        });
      } else { //user didn't have item
        logThis(`You don't have any ${pluralize(value, 4)} to drop!`);
      }
    });
  });
}

//react to input beginning with look command
function lookAround(value) {
  scrubInventory();
  logThis(`You look around.`)
  printLocationDescription(currentLocation);
  printExits(currentExits);
  parseInventory("Location");
}

//function react to input beginning with speak command
function speak(value) {
  value = takeTheseOffThat(actionCalls.speak, value);
  publishMessage(value);
}

//function react to input beginning with emote command
function emote(value) {
  value = takeTheseOffThat(actionCalls.emote, value);
  publishDescription(value);
}


function wearItem(value) {
  value = takeTheseOffThat(actionCalls.wear, value);
  value = takeTheseOffThat(ARTICLES, value);

  getInventory(currentUserId).then(function (data) {
    findMatchByItemName(value, data).then(function (found) {
      if (found) {
        let itemId;
        findItemData(value).then(function (data) {
          itemId = data.id;
          findItemProperty(data).then(function (itemSlot) {
            changeIsEquipped(itemId, currentUserId, 1).then(function (changesuccess) {
              console.log(itemSlot);
              fillPlayerInvSlot(itemId, parseInt(currentUserId.slice(1, currentUserId.length)), itemSlot).then(function (data) {
                logThis(`You put on ${insertArticleSingleValue(value)}.`);
              })
            })
          })
        });
      } else {
        logThis(`You don't have any ${pluralize(value, 4)} to wear!`);
      }
    })
  })
}

function removeItem(value) {
  value = takeTheseOffThat(actionCalls.remove, value);
  value = takeTheseOffThat(ARTICLES, value);
  locateEquippedItems(currentUserData.id).then(function (userEquipment) {
    let itemId;
    findItemData(value).then(function (itemData) {
      itemId = itemData.id;
      findMatchByItemIdInObject(itemId, userEquipment).then(function (itemMatch) {
        if (itemMatch) {
          console.log("Found a match");
          findItemProperty(itemData).then(itemSlot => {
            changeIsEquipped(itemId, currentUserId, -1).then(success => {
              fillPlayerInvSlot(null, currentUserData.id, itemSlot).then(data => {
                logThis(`You take off ${insertArticleSingleValue(value)}.`);
              })
            })
          })
        } else {
          logThis(`You don't have ${insertArticleSingleValue(value)} to take off!`);
        }
      })
    })
  })
}



function parseStats(){
  getStats(currentUserData.characterName).then(stats => {
    let title = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0STATS\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
    let dashes = "---------------------";
    $("#anchor").before(`<p class="displayed-stat">${title}</p>`);
    $("#anchor").before(`<p class="displayed-stat">${dashes}</p>`);

      for (const item in stats) {
        let string = "\xa0\xa0\xa0\xa0";
        if (item.length === 3) {
          string += `\xa0${item}\xa0\xa0\xa0|\xa0\xa0`;
          statValue = parseInt(stats[item]);
          $("#anchor").before(`<p class="displayed-stat">${string}<span id="three">${statValue}</span></p>`);
        } else if (item.length == 2) {
          string += `\xa0${item.toUpperCase()}\xa0\xa0\xa0\xa0\xa0|\xa0\xa0`;
          if (item === "HP"){
            statValue = parseInt(stats[item]);
            $("#anchor").before(`<p class="displayed-stat">${string}<span id="hp">${statValue}</span></p>`);
          } else {
            statValue = parseInt(stats[item]);
            $("#anchor").before(`<p class="displayed-stat">${string}<span id="levels">${statValue}</span></p>`);
          }
        } else {
          string += `${item}\xa0\xa0\xa0|\xa0\xa0`;
          statValue = parseInt(stats[item]);
          $("#anchor").before(`<p class="displayed-stat">${string}<span id="levels">${statValue}</span></p>`);
        }
      }
      $("#anchor").before(`<p class="displayed-stat">${dashes}</p>`);
  })
}







//HIGH LEVEL FUNCTIONS







//MOVE TO A NEW ROOM, AND GET A NEW CHAT
const newLocation = function (direction) {
  let locationIndex;
  // give this chatroom the correct id
  if (direction == "start") {
    //set currentLocation, and pass to pubnub as locationIndex
    getLocation(currentUserData.lastLocation).then(function (data) {
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
    getLocation(currentExits[direction]).then(function (data) {
      currentLocation = data;
      currentExits = compileExits(currentLocation);
      locationIndex = data.locationName.replace(/ /g, "-");
      rememberLocation(currentUserData.characterName, currentLocation.id);

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
  const init = function () {

    pubnub.unsubscribeAll();
    console.log("subscribing");
    pubnub.subscribe({ channels: [channel] });

  };//end init

  init();
}


//RESPOND TO USER INPUT
$("#submit-button").click(function (event) {
  event.preventDefault();

  //log, then clear input value
  let value = $(".chat-input").val();
  console.log(value);
  $(".chat-input").val("");
  userRecentCommands.push(value);

  if (doesThisStartWithThose(value, actionCalls.move)) {
    parseMove(value);
  } else if (value.toLowerCase() === "stop juggling"){
    stopJuggling();
  } else if (doesThisStartWithThose(value, actionCalls.inventory)){
    parseInventory("Player");
  } else if (doesThisStartWithThose(value, actionCalls.speak)){
    speak(value);
  } else if (doesThisStartWithThose(value, actionCalls.look)){
    lookAround(value);
  } else if (juggleTime) {
    logThis("You should probably stop juggling first.");
  }else if (doesThisStartWithThose(value, actionCalls.get)){
    getItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.drop)){
    dropItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.wear)){
    wearItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.remove)) {
    removeItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.emote)) {
    emote(value);
  } else if (doesThisStartWithThose(value, actionCalls.juggle)){
    juggle(value);
  } else if (doesThisStartWithThose(value, actionCalls.stats)){
    parseStats();
  }
});







//PAGE INIT
setActionCalls();