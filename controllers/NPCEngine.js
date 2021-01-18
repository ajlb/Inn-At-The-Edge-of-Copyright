const { response } = require("express");
const npcFunctions = require("./npcactions");
const runConditionals = require("./NPCConditionals");

function parseExampleResponses(responses, user) {
    return responses.map(({ conditionals, example }) => {
        if (conditionals) {
            if (runConditionals(conditionals, { user })) return example
            else return false
        } else return example
    }).filter(s => s ? s : false);
}

module.exports = function (io, { socket, user, NPCName, NPCMessages, messageFromUser, fromClient, route }) {
    let action;
    let socketProp;
    let exampleResponses;
    let messageFromNPC;
    let leavingConversation = false;
    let questTitle;

    messageFromUser = messageFromUser.replace(/[^\w ]/g, '')

    if (messageFromUser.trim() === '' || !messageFromUser || (!route && route !== 0)) {
        // if the message doesn't exist or is an empty string this will run
        route = 0;
        let messageObj = NPCMessages[0];
        messageFromNPC = messageObj.message;
        exampleResponses = parseExampleResponses(messageObj.responses, user);
    } else {
        NPCMessages[route].responses.forEach(responseObj => {
            if (
                (responseObj.allowed.includes(messageFromUser.toLowerCase())) &&
                (!responseObj.conditionals || (responseObj.conditionals && runConditionals(responseObj.conditionals, { user })))
            ) {
                // sets the proper NPC message route 
                route = responseObj.route;

                ({
                    message: messageFromNPC,
                    responses, action,
                    socketProp, questTitle,
                    leavingConversation
                } = NPCMessages[route]);

                if (responses) exampleResponses = parseExampleResponses(responses, user);
            }
        })
    }

    if (messageFromNPC !== undefined) {
        if (action && npcFunctions[NPCName] && npcFunctions[NPCName][action]) {
            npcFunctions[NPCName][action]({ io, socket, socketProp, user, questTitle })
                .then(() => {
                    // emits all the necessary info to the user
                    io.to(fromClient).emit('from NPC', {
                        NPCName,
                        messageFromNPC,
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
                messageFromNPC,
                exampleResponses: exampleResponses,
                leavingConversation,
                route
            });
        }
    } else {
        if (!exampleResponses) exampleResponses = NPCMessages[route].exampleResponses.map(response => {
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
            messageFromNPC: "Hm... I didn't understand that",
            exampleResponses,
            leavingConversation,
            route
        })
    }
}