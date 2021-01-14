const NPCConditionals = {
    HAS: function ({ toHave }, { user: { inventory } }) {
        let hasItem = false;
        inventory.forEach(({ item: { itemName } }) => {
            if (itemName.includes(toHave)) hasItem = true
        })
        return hasItem;
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