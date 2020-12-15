const npcFunctions = require("./npcactions");

function thisStartsWithOneOfThese(string, array) {
    let itDoes = false;
    array.forEach(value => {
        if (string.startsWith(value)) {
            itDoes = true;
        }
    })
    return itDoes;
}

let greetingsArray = ['hello', 'hi', 'hey', 'hello?']; // used to default the user to opening NPC message 
let goodbyeArray = ['goodbye', 'bye', 'adios', 'leave']; // used to trigger if the user is leaving the conversation

module.exports = function (io, { socket, user, NPCName, NPCObj, messageFromUser, fromClient }) {
    let route;
    let action;
    let socketProp;
    let exampleResponses;
    let NPCMessage;
    let leavingConversation = false;

    if (thisStartsWithOneOfThese(messageFromUser.toLowerCase(), goodbyeArray)) {
        // if the user started their message with a goodbye, this will run
        leavingConversation = true
    }

    if (messageFromUser.trim() === '' || !messageFromUser || thisStartsWithOneOfThese(messageFromUser.toLowerCase(), greetingsArray)) {
        // if the message doesn't exist, is an empty string, or begins with a greeting, this will run
        route = 0;
        NPCMessage = NPCObj.messages[0].message;
        exampleResponses = NPCObj.messages[0].exampleResponses;
    } else {
        // This probably looks crazy but just study the NPCs array at the top of ./socket.js and it should make more sense
        NPCObj.messages.forEach(messageObj => {
            messageObj.allowedResponses.forEach(responseObj => {
                if (responseObj.responses.includes(messageFromUser.toLowerCase())) {
                    // sets the proper NPC message route 
                    route = responseObj.route;
                    action = responseObj.action;
                    // these two use the route to get the proper message and example responses from the NPC
                    NPCMessage = NPCObj.messages[route].message;
                    exampleResponses = NPCObj.messages[route].exampleResponses;
                }
            })
        })
    }

    if (route !== undefined) {
        if (action) {
            if (npcFunctions[NPCName] && npcFunctions[NPCName][action]) {
                npcFunctions[NPCName][action]({ io, socket, socketProp, user })
            }
        }
        else console.log('no action')
        // emits all the necessary info to the user
        io.to(fromClient).emit('from NPC', {
            NPCName,
            NPCMessage,
            exampleResponses: exampleResponses.join(', '),
            leavingConversation
        });
    } else {
        io.to(fromClient).emit('from NPC', {
            NPCName,
            NPCMessage: "Hm... I didn't understand that",
            exampleResponses: NPCObj.messages[0].exampleResponses.join(', '),
            leavingConversation
        })
    }
}