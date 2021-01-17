const npcFunctions = require("./npcactions");
const { NPCConditionals, runConditionals } = require("./NPCConditionals");

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
        let messageObj = NPCObj.messages[0];
        NPCMessage = messageObj.message;
        exampleResponses = messageObj.exampleResponses;
    } else {
        NPCObj.messages[route].allowedResponses.forEach(responseObj => {
            if (
                (responseObj.responses.includes(messageFromUser.toLowerCase())) &&
                (!responseObj.conditionals || (responseObj.conditionals && runConditionals(responseObj.conditionals, { user })))
            ) {
                // sets the proper NPC message route 
                route = responseObj.route;
                // these two use the route to get the proper message and example responses from the NPC
                let newMessageObj = NPCObj.messages[route]
                action = newMessageObj.action;
                socketProp = newMessageObj.socketProp;
                questTitle = newMessageObj.questTitle;
                NPCMessage = newMessageObj.message;
                leavingConversation = newMessageObj.leavingConversation;
                exampleResponses = newMessageObj.exampleResponses;
            }
        })
    }

    if (exampleResponses) exampleResponses = exampleResponses.map(response => {
        if (response.conditionals) {
            if (runConditionals(response.conditionals, { user })) {
                return response;
            }
        } else {
            return response;
        }
    }).filter(response => { if (response) return response })

    if (NPCMessage !== undefined) {
        if (action && npcFunctions[NPCName] && npcFunctions[NPCName][action]) {
            npcFunctions[NPCName][action]({ io, socket, socketProp, user, questTitle })
                .then(() => {
                    // emits all the necessary info to the user
                    io.to(fromClient).emit('from NPC', {
                        NPCName,
                        NPCMessage,
                        exampleResponses: exampleResponses,
                        leavingConversation,
                        route
                    });
                })
                .catch(e => {
                    console.log("ERROR IN NPC FUNCTION", e)
                    io.to(socket.id).emit('failure', "Something went wrong")
                })
        } else {
            // emits all the necessary info to the user
            io.to(fromClient).emit('from NPC', {
                NPCName,
                NPCMessage,
                exampleResponses: exampleResponses,
                leavingConversation,
                route
            });
        }
    } else {
        if (!exampleResponses) exampleResponses = NPCObj.messages[route].exampleResponses.map(response => {
            if (response.conditionals) {
                if (runConditionals(response.conditionals, { user })) {
                    return response;
                }
            } else {
                return response;
            }
        }).filter(response => { if (response) return response })

        io.to(fromClient).emit('from NPC', {
            NPCName,
            NPCMessage: "Hm... I didn't understand that",
            exampleResponses,
            leavingConversation,
            route
        })
    }
}