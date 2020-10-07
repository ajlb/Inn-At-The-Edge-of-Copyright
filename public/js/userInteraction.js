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
  
















//begin chatroom

//MOVE TO A NEW ROOM, AND GET A NEW CHAT
const newLocation = function(direction) {

    // give this chatroom the correct id
    if (direction === "start") {
      locationIndex = "Empty-Room-At-The-Inn";
      $("#anchor").before(`<p class="displayed-message" style="color:rgb(249, 255, 199)">In: ${locationIndex.replace(/-/g, " ")}</p>`);
      //below: display description
      //$("#anchor").before(`<p class="displayed-description">${woodsWalk.location[locationIndex].descriptions["light"]}</p>`);
      //compile exits
      //describeThis(availableExits);
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
  
  //INITIALIZE PAGE
  newLocation("start");