const NPCConditionals = {
    hasItem: function ({ toHave }, { user: { inventory } }) {
        let hasItem = false;
        inventory.forEach(({ item: { itemName } }) => {
            if (itemName === toHave) hasItem = true
        })
        return hasItem;
    },
    notHasToken: function ({ tokenNotHad }, { user: { tokens } }) {
        let hasToken = false;
        tokens.forEach(({ name, quantity }) => {
            if (name === tokenNotHad && quantity > 0) hasToken = true;
        });
        return !hasToken;
    },
    hasToken: function ({ tokenToHave }, { user: { tokens } }) {
        let hasToken = false;
        tokens.forEach(({ name, quantity }) => {
            if (name === tokenToHave && quantity > 0) hasToken = true;
        });
        return hasToken;
    },
    notStartedQuest: function ({ questTitle }, { user: { quests } }) {
        let hasStarted = false;
        quests.forEach(({ title }) => {
            if (title === questTitle) hasStarted = true
        })
        return !hasStarted
    },
    hasQuestObjective: function ({ questTitle, hasReference }, { user: { quests } }) {
        let hasObjective = false;
        console.log("questTitle:", questTitle)
        console.log("hasReference", hasReference)
        console.log("quests", quests)
        return hasObjective;
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