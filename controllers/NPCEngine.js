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

module.exports = function (io, { socket, user, NPCName, NPCObj, messageFromUser, fromClient, route }) {
    let action;
    let socketProp;
    let exampleResponses;
    let NPCMessage;
    let leavingConversation = false;

    messageFromUser = messageFromUser.replace(/[^\w ]/g, '')

    if (messageFromUser.trim() === '' || !messageFromUser || (!route && route !== 0)) {
        // if the message doesn't exist, is an empty string, or begins with a greeting, this will run
        route = 0;
        NPCMessage = NPCObj.messages[0].message;
        exampleResponses = NPCObj.messages[0].exampleResponses;
    } else {
        NPCObj.messages[route].allowedResponses.forEach(responseObj => {
            if (responseObj.responses.includes(messageFromUser.toLowerCase())) {
                // sets the proper NPC message route 
                route = responseObj.route;
                // these two use the route to get the proper message and example responses from the NPC
                let newMessageObj = NPCObj.messages[route]
                action = newMessageObj.action;
                socketProp = newMessageObj.socketProp;
                NPCMessage = newMessageObj.message;
                exampleResponses = newMessageObj.exampleResponses;
                leavingConversation = newMessageObj.leavingConversation;
            }
        })
    }

    if (NPCMessage !== undefined) {
        if (action) {
            if (npcFunctions[NPCName] && npcFunctions[NPCName][action]) {
                npcFunctions[NPCName][action]({ io, socket, socketProp, user })
            }
        }
        // emits all the necessary info to the user
        io.to(fromClient).emit('from NPC', {
            NPCName,
            NPCMessage,
            exampleResponses: exampleResponses,
            leavingConversation,
            route
        });
    } else {
        io.to(fromClient).emit('from NPC', {
            NPCName,
            NPCMessage: "Hm... I didn't understand that",
            exampleResponses: NPCObj.messages[route].exampleResponses,
            leavingConversation,
            route
        })
    }
}