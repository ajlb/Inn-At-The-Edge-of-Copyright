module.exports = function(app){
    app.get("/v2/subscribe/sub-c-9fd7a810-f093-11ea-92d8-06a89e77181a/Pumpkin-Patch-Center/0?tt=0")
}

///publish/{pub_key}/{sub_key}/0/{channel}/{callback}/{payload}{?store,uuid}


///publish/pub-c-3b1a90da-b8c6-4753-a965-7fd056636e55/sub-c-9fd7a810-f093-11ea-92d8-06a89e77181a/0/ch1/myCallback?store=0&uuid=db9c5e39-7c95-40f5-8d71-125765b6f561

//subscribe
///v2/subscribe/{sub_key}/{channel}/{callback}{?uuid,tt,tr,state,filter-expr}




let currentUsers = [];



function assignRandomUserName() {
    const nouns = ["Mongoose", "Hummingbird", "Capybara", "Salmon", "Guppy", "Skink", "Llama", "Lemur", "Cuttlefish"];
    const colors = ["Red", "Yellow", "Blue", "Green", "Orange", "Purple", "Pink", "Violet", "Magenta"];

    let thisName = colors[Math.floor(Math.random() * colors.length)] + nouns[Math.floor(Math.random() * nouns.length)];
    if (currentUsers.indexOf(thisName) === -1) {
        currentUsers.push(thisName);
        return thisName;
    } else {
        assignRandomUserName();
    }
}//end assignRandomUserName()

let thisUser = assignRandomUserName();

const pubnub = new PubNub({
    publishKey: 'pub-c-3b1a90da-b8c6-4753-a965-7fd056636e55',
    subscribeKey: 'sub-c-9fd7a810-f093-11ea-92d8-06a89e77181a',
    uuid: thisUser
});

async function publishSampleMessage() {
    console.log(
        "Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish."
    );
    const result = await pubnub.publish({
        channel: "hello_world",
        message: {
            title: "greeting",
            description: "hello world!",
        },
    });
    console.log(result);
}

pubnub.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            publishSampleMessage();
        }
    },
    message: function (messageEvent) {
        console.log(messageEvent.message.title);
        console.log(messageEvent.message.description);
    },
    presence: function (presenceEvent) {
        // handle presence
    },
});

//write the messages out to the chat box
displayMessage = function (messageType, aMessage) {
    console.log(aMessage);
    $("#anchor").before(`<p class="displayed-message">${aMessage.publisher}: ${aMessage.message.text}</p>`);
    updateScroll();
}

//publish text to pubnub server as a message
function publishMessage(value) {
    pubnub.publish({
        channel: channel,
        message: { "text": value },
    },

        function (status, response) {
            console.log("Publishing from submit button event");
            if (status.error) {
                console.log(status);
                console.log(response);
            }
        }
    );
}

console.log("Subscribing..");

pubnub.subscribe({
    channels: ["hello_world"],
});


