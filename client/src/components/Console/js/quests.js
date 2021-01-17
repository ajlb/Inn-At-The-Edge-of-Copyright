function filterAndFindQuest(user, input) {
    let foundQuest = user.quests.find(quest => quest.title.toLowerCase() === input)
        || user.quests.find(quest => quest.title.toLowerCase().startsWith(input) && /\w\s\w/.test(input))
        || user.quests.find(quest => quest.title.toLowerCase().replace(/(the |a |an )/, '') === input)
        || user.quests.find(quest => quest.title.toLowerCase().replace(/(the |a |an )/, '').split(' ').includes(input))

    return foundQuest
}

function runQuests({ user, input, setChatHistory, socket }) {
    if (!input || input === '') {
        let toDisplay = [
            "\xa0\xa0\xa0\xa0",
            "QUESTS",
            "\xa0\xa0\xa0\xa0"
        ]

        user.quests.sort((a, b) => {
            if (a.completed && b.completed) {
                return 0
            } else if (a.completed) {
                return 1
            } else if (b.completed) {
                return -1
            }
        })

        user.quests.forEach(({ title, completed }, index) => {
            toDisplay.push({
                type: "displayed-indent" + (completed ? " faded" : " font-weight-bold"),
                text: `${index + 1}. ${title}`
            })
        })
        if (user.quests.length === 0) {
            toDisplay.push("You have not unlocked any quests")
        }
        toDisplay.push('\xa0\xa0\xa0\xa0')

        toDisplay = toDisplay.map(val => {
            if (typeof val === 'object') {
                return val
            } else {
                return { type: "displayed-indent", text: val }
            }
        })

        if (user.quests.length <= 3 && user.quests.length > 0) {
            toDisplay.push({ type: "displayed-commands", text: '\xa0\xa0\xa0\xa0' })
            toDisplay.push({ type: "displayed-commands faded", text: `Try entering: check quest 1` })
        }

        setChatHistory(prevState => [...prevState].concat(toDisplay));

    } else {
        if (!isNaN(input)) {
            input = parseInt(input)
            if (user.quests[input - 1]) {
                let questToGet = user.quests[input - 1]
                socket.emit('getQuest', { questToGet })
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: `Quest #${input} not found` }])
            }
        } else {
            let questToGet = filterAndFindQuest(user, input);
            if (questToGet) {
                socket.emit('getQuest', { questToGet })
            } else {
                setChatHistory(prevState => [...prevState, { type: "displayed-error", text: "You haven't unlocked any quests by that name" }]);
            }
        }
    }
}

export default runQuests;