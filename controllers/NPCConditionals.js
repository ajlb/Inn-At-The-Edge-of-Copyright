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