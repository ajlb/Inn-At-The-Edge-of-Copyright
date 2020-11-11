function runNPC(target, message, logThis, describeThis, listThis) {
    getDialog(target).then(dialogRow => {
        let dialog = JSON.parse(dialogRow.dialogObj);
        let greetingArray = ["hello", "hey", "what's up", "whats up", "hi"]
        if (message.trim() === '' || greetingArray.includes(message.toLowerCase())) {
            logThis(`${target}: ${dialog.messages[0].message}`)
            describeThis(`Responses: ${dialog.messages[0].exampleResponses.join(', ')}`)
        } else {
            let route;

            dialog.messages.forEach(messageObj => {
                messageObj.allowedResponses.forEach(responseObj => {
                    if (responseObj.responses.includes(message.toLowerCase())) {
                        route = responseObj.route
                    }
                })
            })

            logThis(`${target}: ${dialog.messages[route].message}`)
            describeThis(`Responses: ${dialog.messages[route].exampleResponses.join(', ')}`)
        }
    })
}

export default runNPC;