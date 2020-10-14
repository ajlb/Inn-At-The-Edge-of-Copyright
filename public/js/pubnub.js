//prepare variables for global scope
let pubnub;
let channelName;
let channelGroup;
let publishTimetoken;
let msg;
let publisher;
let unixTimestamp;
let gmtDate;
let localeDateTime;
let affectedChannels;
let category;
let operation;
let action;
let uuid;
let thisUser;
function createConnection(thisUser){
  pubnub = new PubNub({
      publishKey: 'pub-c-3b1a90da-b8c6-4753-a965-7fd056636e55',
      subscribeKey: 'sub-c-9fd7a810-f093-11ea-92d8-06a89e77181a',
      uuid: thisUser
    });
    //add a listener to the pubnub object to receive incoming messages etc.
  pubnub.addListener({
    message: (message) => {
      displayMessage('[MESSAGE: received]', message);
      channelName = message.channel;
      channelGroup = message.subscription;
      publishTimetoken = message.timetoken;
      msg = message.message;
      publisher = message.publisher;
      unixTimestamp = message.timetoken / 10000000;
      gmtDate = new Date(unixTimestamp * 1000);
      localeDateTime = gmtDate.toLocaleString();
    },
    status: (status) => {
      affectedChannels = status.affectedChannels;
      category = status.category;
      operation = status.operation;
    },
    presence: (presence) => {
      action = presence.action;
      channelName = presence.channel;
      uuid = presence.uuid;
    },
  });//end addListener
}
//write the messages out to the chat box
displayMessage = function(messageType, aMessage) {
  console.log(aMessage);
  $("#anchor").before(`<p class="displayed-message">${aMessage.message.text}</p>`);
  updateScroll();
}
function publishDescription(value){
  pubnub.publish({
    channel: channel,
    message: {"text":`${thisUser} ${value}`},
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
//publish text to pubnub server as a message
function publishMessage(value){
  pubnub.publish({
    channel: channel,
    message: {"text":`${thisUser}: ${value}`},
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
//page init
getPlayerFromLoginInfo().then(data => {
  thisUser=data.characterName;
  createConnection(thisUser);
  setUserInventoryId().then(userData=>{
    newLocation("start");
  });
});
