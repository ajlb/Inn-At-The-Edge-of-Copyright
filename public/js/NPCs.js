function runNPC(target, message, logThis, describeThis, listThis) {
    getDialog(target).then(dialogRow => {
        console.log(dialogRow)
        let dialog = JSON.parse(dialogRow.dialogObj);
        console.log('dialog object: ', dialog)
        console.log('message: ', message)
        if (message.trim() === '') {
            logThis(`${target}: ${dialog.messages[0].message}`)
            describeThis(`Responses: ${dialog.messages[0].exampleResponses.join(', ')}`)
        } else {
            let route;

            dialog.messages.forEach(messageObj => {
                console.log('messageObj: ', messageObj);
                messageObj.allowedResponses.forEach(responseObj => {
                    console.log('responseObj: ', responseObj)
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