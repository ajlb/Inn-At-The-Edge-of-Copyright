import {doesThisStartWithThose, takeTheseOffThat} from "../js/finders";
import {changeItemQuantity, scrubInventory, getPlayerData, getActions, getLocation, rememberLocation, getInventory, whosOnline, addItemToInventory, findItemData, getStats, incrementStat, changeIsEquipped, fillPlayerInvSlot, locateEquippedItems} from "../js/apiCalls";
import runNPC from "./NPCs";
import pluralize from "pluralize";

//CONSTANT VARIABLES
const DIRECTIONWORDS = { N: ["n", "north"], E: ["e", "east"], S: ["s", "south"], W: ["w", "west"] };
const ARTICLES = ["the", "a", "an"];
const MULTIPLES = ["set", "pair", "box", "bag"];
const VOWELS = ["a", "e", "i", "o", "u"];

//LOCATION, ACTION, USER DATA
let currentLocation; //holds all data for current location
let currentExits; //easily accessible exit data
let currentLocationId; //location ID prefixed with "L"
let currentLocationInventory; //inventory of this location
let isDay = true;
let actionData = {};
let actionCalls = {};
let currentUserData;
let currentUserId;
let locationIndex;
let locationOccupants;

let position = "standing";
let sleepInterval;
let sleeping = false;

let userRecentCommands = [];
let userRecentCommandsIndex;



//print info to user
function logThis(text) {
  $("#anchor").before(`<p class="displayed-message">${text}</p>`);
  updateScroll();
}

//print info to user in yellow with indent
function describeThis(text) {
  $("#anchor").before(`<p class="displayed-description">${text}</p>`);
  updateScroll();
}

//print info out to user with small margins between items
function listThis(text) {
  $("#anchor").before(`<p class="displayed-stat">${text}</p>`);
}

//Pull scroll bar to bottom
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

//put "a" before consonants and y, put "an" before vowels
function insertArticleSingleValue(value) {
  if (doesThisStartWithThose(value, VOWELS)) {
    return `an ${value}`;
  } else {
    return `a ${value}`;
  }
}




//FINDER FUNCTIONS

//find where an item is wearable
function findItemSlot(itemData) {
  return new Promise(function (resolve, reject) {
    for (const property in itemData) {
      if (property.endsWith("Slot") && (itemData[property] === true)) {
        resolve(property);
      }
    }
  });
}

//find an item in data by name
function findMatchByItemName(value, data) {
  return new Promise(function (resolve, reject) {
    for (const item of data) {
      if (item.item.itemName.toLowerCase() === value.toLowerCase()) {
        resolve(item);
      }
    }
    resolve(false);
  }).catch(e=>{
    console.log("Error:");
    console.log(e.message);
  });
}

//Find NPC to talk to
function findMatchByCharacterName(name) {
  return new Promise(function (resolve, reject) {
    let NPCList = currentLocation.NPCs.split(", ");
    for (const NPC of NPCList) {
      if (name === NPC) {
        resolve();
      }
    }
    reject();
  });
}

//Find an item in data by ID
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

//Find an item in data by name and change the quantity
function findMatchByItemNameAndChangeQuantity(value, data, target, amount) {
  return new Promise(function (resolve, reject) {
    let wasItIn;
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




//SINGLE PURPOSE HELPER FUNCTIONS (functions that save on function length elsewhere)

//get user Id from pubnub, then put into string for searching inventories
function setUserInventoryId() {
  return new Promise(function (resolve, reject) {
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

//print who's online
function parseWhosOnline() {
  let string = "";
  let occupants = [];
  whosOnline().then(residents => {
    locationOccupants = residents;
    let locationKey = Object.keys(residents.channels)[0];
    if (!(residents.channels[locationKey] === undefined) && (residents.channels[locationKey].occupants.length > 0)) {
      for (const occupant of residents.channels[locationKey].occupants) {
        occupants.push(occupant.uuid);
      }
      string += occupants.join(", ");
      $("#location-info").html(`<p class="displayed-description">In ${currentLocation.locationName}: ${string}</p>`);
    }
  })
}




//USER INPUT FUNCTIONS


function parseMove(value) {
  if (position === "standing") {
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
  } else {
    logThis("You'll need to stand up for that!")
  }
}


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
        currentLocationInventory = [];
        let locationInventory = [];
        for (const item of data) {
          //check if item is in a set, and if not, pluralize
          locationInventory.push(`${item.quantity} ${pluralizeAppropriateWords(item.item.itemName, item.quantity)}`);
        }
        currentLocationInventory = locationInventory;
        if (currentLocationInventory.length > 0){
          describeThis(`You see: ${currentLocationInventory.join(", ")}`);
          resolve(currentLocationInventory);
        } else {
          resolve(false);
        }
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


function speak(value) {
  if (value.toLowerCase().startsWith("speak to") || value.toLowerCase().startsWith("talk to") || value.toLowerCase().startsWith("say to")) {
    value = takeTheseOffThat(["speak to ", "talk to ", "say to "], value.trim());
    let target = value.split(" ")[0];
    let message = value.split(" ").slice(1).join(' ');
    target = target[0].toUpperCase() + target.slice(1);
    findMatchByCharacterName(target)
      .then(() => {
        runNPC(target, message, logThis, describeThis, listThis);
      })
      .catch((err) => {
        console.log(err)
        logThis('You cannot speak directly to ' + target)
      })
  } else {
    value = takeTheseOffThat(actionCalls.speak, value);
    publishMessage(value);
    updateScroll();
  }
}


//react to user input beginning with NPC name in room
function talkDirectlyToNPC(value){
  let target = value.split(" ")[0];
  target = target.replace(",", "");
  let message = value.split(" ").slice(1).join(' ');
  target = target[0].toUpperCase() + target.slice(1);
  findMatchByCharacterName(target)
    .then(() => {
      runNPC(target, message, logThis, describeThis, listThis);
    })
    .catch((err) => {
      console.log(err)
      logThis('You cannot speak directly to ' + target)
    })
}


function displayHelp(value) {
  if (value.toLowerCase() === "help") {
    let title = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0HELP\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
    let dashes = "---------------------";
    listThis(title);
    listThis(dashes);
    for (const action of actionData) {
      listThis(`${action.actionName}\xa0\xa0\xa0\xa0\xa0 --${action.commandBriefDescription}`)
      updateScroll();
    }
    logThis(" ");
    updateScroll();
  } else {
    for (const action of actionData) {
      console.log(action.actionName);
      if (value.split(" ")[1].toLowerCase() == action.actionName) {
        listThis(action.actionName.toUpperCase());
        listThis(" ");
        listThis(action.commandLongDescription);
        listThis(" ");
        listThis(`example: ${action.exampleCall}\xa0\xa0\xa0\xa0\xa0 --result: ${action.exampleResult}`);
        listThis(" ");
        updateScroll();
        break;
      }
    }
    logThis(" ");
    updateScroll();
  }
}


function lookAround(value) {
  scrubInventory();
  logThis(`You look around.`)
  printLocationDescription(currentLocation);
  printExits(currentExits);
  parseInventory("Location");
}


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
            logThis(`You pick up ${insertArticleSingleValue(value)}.`);
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
          logThis(`You drop ${insertArticleSingleValue(value)}.`);
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


function wearItem(value) {
  value = takeTheseOffThat(actionCalls.wear, value);
  value = takeTheseOffThat(ARTICLES, value);

  getInventory(currentUserId).then(function (data) {
    findMatchByItemName(value, data).then(function (found) {
      if (found) {
        let itemId;
        findItemData(value).then(function (data) {
          itemId = data.id;
          findItemSlot(data).then(function (itemSlot) {
            changeIsEquipped(itemId, currentUserId, 1).then(function (changesuccess) {
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
      if(!(itemData == null)){
        itemId = itemData.id;
        findMatchByItemIdInObject(itemId, userEquipment).then(function (itemMatch) {
          if (itemMatch) {
            findItemSlot(itemData).then(itemSlot => {
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
      } else {
        logThis("hmmm... not sure what a " + value + " is.");
      } 
    })
  })
}


function emote(value) {
  value = takeTheseOffThat(actionCalls.emote, value);
  publishDescription(value);
}


function parseStats() {
  getStats(currentUserData.characterName).then(stats => {
    let title = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0STATS\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
    let dashes = "---------------------";
    $("#anchor").before(`<p class="displayed-stat">${title}</p>`);
    $("#anchor").before(`<p class="displayed-stat">${dashes}</p>`);
    let maxHP = stats.maxHP;
    delete stats.maxHP;
    for (const item in stats) {
      let string = "\xa0\xa0\xa0\xa0";
      if (item.length === 3) {
        string += `\xa0${item}\xa0\xa0\xa0|\xa0\xa0`;
        const statValue = parseInt(stats[item]);
        $("#anchor").before(`<p class="displayed-stat">${string}<span id="blue">${statValue}</span></p>`);
      } else if (item.length == 2) {
        string += `\xa0${item.toUpperCase()}\xa0\xa0\xa0\xa0\xa0|\xa0\xa0`;
        if (item === "HP" && stats["HP"] < maxHP) {
          const statValue = parseInt(stats[item]);
          $("#anchor").before(`<p class="displayed-stat">${string}<span id="red">${statValue}</span>/${maxHP}</p>`);
        } else if (item === "HP" && stats["HP"] >= maxHP) {
          const statValue = parseInt(stats[item]);
          $("#anchor").before(`<p class="displayed-stat">${string}<span id="green">${statValue}</span>/${maxHP}</p>`);
        } else {
          const statValue = parseInt(stats[item]);
          $("#anchor").before(`<p class="displayed-stat">${string}<span id="levels">${statValue}</span></p>`);
        }
      } else {
        string += `${item}\xa0\xa0\xa0|\xa0\xa0`;
        const statValue = parseInt(stats[item]);
        $("#anchor").before(`<p class="displayed-stat">${string}<span id="levels">${statValue}</span></p>`);
      }
    }
    $("#anchor").before(`<p class="displayed-stat">${dashes}</p>`);
    updateScroll();
  })
}


function sleep() {
  if (position === "laying") {
    if (!sleeping){
      logThis("You fall into a deep slumber");
      sleeping = true;
      pubnub.unsubscribeAll();
      publishDescription("falls asleep.");
      let i = 0;
      sleepInterval = setInterval(function () {
        getStats(currentUserData.characterName).then(stats => {
          if ((i > 1) && (stats.HP < stats.maxHP)) {
            incrementStat("HP", 1, currentUserData.characterName);
          }
          i++;
        });
      }, 5000);
    } else {
      logThis("... you're already asleep.");
    }
  } else {
    logThis("You'll need to lie down for that!");
  }
}


function wake() {
  if (sleeping){
    publishDescription("opens their eyes");
    sleeping = false;
    clearInterval(sleepInterval);
    const id = currentLocation.locationName.replace(/ /g, "-");
    channel = 'oo-chat-' + id;
    console.log("In Room ID: " + id);
    pubnub.subscribe({ channels: [channel] });
    logThis("You wake up.")
  } else {
    logThis("You can't wake up if you're not asleep.");
  }
}


function sitStandLie(value) {
  if (value == "stand" || value == "stand up") {
    if (!(position === "standing")){
      position = "standing";
      publishDescription("stands up.");
    } else {
      logThis("You're already standing!");
    }
  } else if (value == "sit" || value == "sit down") {
    if (!(position === "sitting")){
      position = "sitting";
      publishDescription("sits down.");
    } else {
      logThis("You're already sitting!");
    }
  } else if (value == "lay" || value == "lay down" || value == "lie" || value == "lie down") {
    if (!(position === "laying")){
      position = "laying";
      publishDescription("lies down.");
    } else {
      logThis("You're already lying down!");
    }
  }
}


function giveItem(value) {
  value = takeTheseOffThat(actionCalls.give, value);
  value = takeTheseOffThat(ARTICLES, value);
  let target;
  let item;
  console.log("In Give:");
  console.log(value);
  
  function splitOnTo(value){
    return new Promise(function(resolve, reject){
      if (value.split(" to ").length == 2){
        target = value.split(" to ")[1];
        item = value.split(" to ")[0];
        resolve();
      } else {
        item = value.split(" to ")[0];
        target = value.slice(item.length+3);
        resolve();
      }
    }).catch(e=>{
      console.log(e.message);
    })
  }

  splitOnTo(value).then(function(){
    console.log(target);
    console.log(item);
    getInventory(currentUserId).then(userInv => {
      findMatchByItemNameAndChangeQuantity(item, userInv, currentUserId, -1).then(success=>{
        if (success){//user had it
          getPlayerData(target).then(otherPlayerData => {
            let otherPlayerId = "P" + otherPlayerData.id;
            getInventory(otherPlayerId).then(otherPlayerInv=>{
              findMatchByItemNameAndChangeQuantity(item, otherPlayerInv, otherPlayerId, 1).then(otherPlayerSuccess => {
                if (otherPlayerSuccess){//other player had one
                  publishDescription(`gives ${insertArticleSingleValue(item)} to ${target}.`);
                } else {//other player didn't have one
                  findItemData(item).then(itemData=>{
                    addItemToInventory(itemData.id, otherPlayerId, 1);
                    publishDescription(`gives ${insertArticleSingleValue(item)} to ${target}.`);
                  })
                }
              })
            })
          })
        } else {//user didn't have it
          logThis(`You don't seem to have ${insertArticleSingleValue(value)} to give...`);
        }
      })
    })
  })
}

//ISSUE - user can't currently examine equipped items
//ISSUE - user can't currently examine players
//ISSUE - user can't currently get secondary info (wearability, etc)
function examine(value){
  value = takeTheseOffThat(actionCalls.examine, value);
  value = takeTheseOffThat(ARTICLES, value);
  
  if (value.toLowerCase().startsWith("self")){
    logThis(currentUserData.description);
    parseStats();
    locateEquippedItems(currentUserData.id).then(playerEquipment => {
      console.log(playerEquipment);
    })

  }

  findItemData(value).then(itemData=>{
    if (itemData == null){
      //need to change getPlayerData to work with player name instead of ID
    } else {
      getInventory(currentUserId).then(userInv=>{
        findMatchByItemName(value, userInv).then(existingItem=>{
          if(existingItem){
            logThis(`You look closely at ${insertArticleSingleValue(value)}.`);
            logThis(`You see ${itemData.description}.`);
          } else {
            getInventory(currentLocationId).then(locationInv=>{
              findMatchByItemName(value, locationInv).then(existingItem => {
                if (existingItem){
                  logThis(`You look closely at ${insertArticleSingleValue(value)}.`);
                  logThis(`You see ${itemData.description}.`);
                } else {
                  logThis(`There doesn't seem to be ${insertArticleSingleValue(value)} here.`);
                }//end if else location has item
              })
            })//end if/else user has item
          }
        })
      })
    }
  })
}





//MAIN REPEATED FUNCTIONS OF PROGRAM

//SET INFO FOR NEW LOCATION
function findNewLocationData(direction) {
  return new Promise(function (resolve, reject) {
    if (direction == "start") {
      getLocation(currentUserData.lastLocation).then(function (data) {
        //set variables and print descriptions
        currentLocation = data;
        currentLocationId = "L" + data.id;
        locationIndex = data.locationName.replace(/ /g, "-");
        $("#location-info").html(`<p class="displayed-description">In ${currentLocation.locationName}</p>`);
        $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">${currentLocation.locationName}</p>`);
        printLocationDescription(currentLocation);
        currentExits = compileExits(currentLocation);
        printExits(currentExits);
        //give user dull ring on entering starting hallway
        if (data.id == 1002){
          getInventory(currentUserId).then(function(userInv){
            findMatchByItemName("dull ring", userInv).then(success=>{
              console.log("looking in your bags");
              if(!success){
                console.log("it's a desolate place have a ring")
                addItemToInventory(131, currentUserId, 1);
              }
            })
          })
        }
        setTimeout(parseWhosOnline(), 4000);
        updateScroll();
        resolve();
      });
    } else if (!(currentExits[direction] == null)) {
      //set currentLocation, and pass to pubnub as locationIndex
      getLocation(currentExits[direction]).then(function (data) {
        //set variables and print descriptions
        currentLocation = data;
        currentLocationInventory = [];
        currentExits = compileExits(currentLocation);
        currentLocationId = "L" + data.id;
        locationIndex = data.locationName.replace(/ /g, "-");
        rememberLocation(currentUserData.characterName, currentLocation.id);
        $("#location-info").html(`<p class="displayed-description">In ${currentLocation.locationName}</p>`);
        $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">${currentLocation.locationName}</p>`);
        printLocationDescription(currentLocation);
        printExits(currentExits);
        setTimeout(parseWhosOnline(), 4000);
        updateScroll();
        resolve();
      });
    } else {
      logThis("There's no exit at " + direction);
      resolve();
    }
  })
}





//MOVE TO A NEW ROOM, AND GET A NEW CHAT
const newLocation = function (direction) {
  // give this chatroom the correct id
  findNewLocationData(direction).then(function () {

    // set channel off of locationIndex channel
    const id = locationIndex;
    channel = 'oo-chat-' + locationIndex;
    console.log("In Room ID: " + locationIndex);

    // this function is fired when Chatroom() is called
    //it unsubscribes from previous rooms, and subscribes to the new room
    const init = function () {

      pubnub.unsubscribeAll();
      console.log("subscribing");
      pubnub.subscribe({
        channels: [channel],
        withPresence: true,
      });


    };//end init

    init();
  })
}


//RESPOND TO USER INPUT
$("#submit-button").click(function (event) {
  event.preventDefault();

  //log, then clear input value
  let value = $(".chat-input").val();
  $(".chat-input").val("");
  userRecentCommands.push(value);

  if (doesThisStartWithThose(value, actionCalls.move)) {
    parseMove(value);
  } else if (value.toLowerCase() === "stop juggling") {
    stopJuggling();
  } else if (doesThisStartWithThose(value, actionCalls.inventory)) {
    parseInventory("Player");
  } else if (doesThisStartWithThose(value, actionCalls.speak)) {
    speak(value);
  } else if (doesThisStartWithThose(value, currentLocation.NPCs.split(", "))) {
    talkDirectlyToNPC(value);
  } else if (doesThisStartWithThose(value, actionCalls.help)) {
    displayHelp(value);
  } else if (doesThisStartWithThose(value, actionCalls.look)) {
    lookAround(value);
  } else if (juggleTime) {//following actions can't be done while juggling
    logThis("You should probably stop juggling first.");
  } else if (doesThisStartWithThose(value, actionCalls.get)) {
    getItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.drop)) {
    dropItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.wear)) {
    wearItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.remove)) {
    removeItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.emote)) {
    emote(value);
  } else if (doesThisStartWithThose(value, actionCalls.juggle)) {
    juggle(value);
  } else if (doesThisStartWithThose(value, actionCalls.stats)) {
    parseStats();
  } else if (doesThisStartWithThose(value, actionCalls.sleep)) {
    sleep();
  } else if (doesThisStartWithThose(value, actionCalls.wake)) {
    wake();
  } else if (doesThisStartWithThose(value, actionCalls.position)) {
    sitStandLie(value);
  } else if (doesThisStartWithThose(value, actionCalls.give)) {
    giveItem(value);
  } else if (doesThisStartWithThose(value, actionCalls.examine)) {
    examine(value);
  } else {
    logThis("hmmm... that didn't quite make sense. Try 'help' for a list of commands!");
  }
});


//fill previous commands into input field on arrow up and arrow down
$(".chat-input").keydown(function(event){
  if (event.which == 38){
    userRecentCommandsIndex -= 1;
    $(".chat-input").val(userRecentCommands[userRecentCommandsIndex]);
  } else if (event.which == 40){
    userRecentCommandsIndex += 1;
    $(".chat-input").val(userRecentCommands[userRecentCommandsIndex]);
  } else if (event.which == 13){
    userRecentCommandsIndex = userRecentCommands.length + 1;
  }
});


  //PAGE INIT
setActionCalls();