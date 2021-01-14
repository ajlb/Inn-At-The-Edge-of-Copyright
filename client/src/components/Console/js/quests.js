function runQuests({ user, input, setChatHistory, socket }) {
    if (!input || input == '') {
        let toDisplay = [
            "\xa0\xa0\xa0\xa0",
            "QUESTS",
            "\xa0\xa0\xa0\xa0"
        ]
        user.quests.forEach(({ title }, index) => {
            toDisplay.push(`${index + 1}. ${title}`)
        })
        if (user.quests.length === 0) {
            toDisplay.push("You have not unlocked any quests")
        }
        toDisplay.push('\xa0\xa0\xa0\xa0')

        toDisplay = toDisplay.map(str => { return { type: "displayed-indent", text: str } })

        if (user.quests.length <= 3) {
            toDisplay.push({ type: "displayed-commands", text: '\xa0\xa0\xa0\xa0' })
            toDisplay.push({ type: "displayed-commands faded", text: `Try entering: check quest 1` })
        }

        setChatHistory(prevState => [...prevState].concat(toDisplay));

    } else {
        if (!isNaN(input)) {
            input = parseInt(input)
            if (user.quests[input - 1]) {
                let questToGet = user.quests[input - 1]
                console.log(questToGet)
                socket.emit('getQuest', { questToGet })
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `Quest #${input} not found` }])
            }
        } else {
            let questToGet = user.quests.find(quest => quest.title.toLowerCase().replace(/(the |a |an )/, '').split(' ').includes(input));
            if (questToGet) {
                console.log(questToGet)
                socket.emit('getQuest', { questToGet })
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: "You haven't unlocked any quests by that name" }]);
            }
        }
    }
}

export default runQuests;