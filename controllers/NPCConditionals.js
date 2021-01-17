const NPCConditionals = {
    hasItem: function ({ toHave }, { user: { inventory } }) {
        let foundItem = inventory.find(({ item: { itemName }, quantity }) => {
            return itemName === toHave && quantity > 0
        });
        return foundItem ? true : false;
    },
    notHasToken: function ({ tokenNotHad }, { user: { tokens } }) {
        let notHasToken = tokens.find(({ name, quantity }) => name === tokenNotHad && quantity > 0) ? false : true;
        return notHasToken;
    },
    hasToken: function ({ token }, { user: { tokens } }) {
        let hasToken = tokens.find(({ name, quantity }) => name === token && quantity > 0) ? true : false;
        console.log("has token:", hasToken)
        return hasToken;
    },
    notStartedQuest: function ({ questTitle }, { user: { quests } }) {
        let hasNotStarted = quests.find(({ title }) => title === questTitle) ? false : true;
        return hasNotStarted;
    },
    startedQuest: function ({ questTitle }, { user: { quests } }) {
        let hasStarted = quests.find(({ title }) => questTitle === title) ? true : false;
        return hasStarted;
    },
    hasQuestObjective: function ({ questTitle, hasReference }, { user: { quests } }) {
        // incomplete, do not use
        let hasObjective = false;
        return hasObjective;
    },
    notCompletedQuest: function ({ questTitle }, { user: { quests } }) {
        let hasNotCompletedQuest = quests.find(({ title, completed }) => title === questTitle && !completed) ? true : false;
        console.log("not completed quest:", hasNotCompletedQuest)
        return hasNotCompletedQuest;
    },
    completedQuest: function ({ questTitle }, { user: { quests } }) {
        let hasCompletedQuest = quests.find(({ title, completed }) => title === questTitle && completed) ? true : false;
        return hasCompletedQuest;
    }
}

function runConditionals(conditionals, options) {
    conditionals = conditionals.map(conditionalObj => {
        const condition = conditionalObj.condition;
        if (NPCConditionals[condition](conditionalObj, options)) return true
        else return false
    })
    return !conditionals.includes(false);
}

module.exports = { NPCConditionals, runConditionals };