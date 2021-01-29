function NPCChecks(NPCs, message) {
    return new Promise((res, rej) => {
        let startsWithNPC = false;
        let NPCName;
        // let NPCObj;

        if (message.startsWith("the")) {
            // removes the
            message = message.split(' ').slice(1).join(' ');
        }

        // This runs three times!
        for (let i = 2; i >= 0; i--) {
            const NPCGuess = message.toLowerCase().split(' ').slice(0, i + 1).join(' ');
            NPCs.forEach(NPC => {
                if (NPC.names.includes(NPCGuess)) {
                    startsWithNPC = true;
                    NPCName = NPC.primaryName;
                    // NPCObj = NPC;
                    message = message.split(' ').slice(i + 1).join(' ');
                }
            })
        }

        if (startsWithNPC) {
            res({ NPCName, message })
        } else {
            rej({ status: 204, message: `Doesn't start with NPC` })
        }
        // if (startsWithNPC && thisStartsWithOneOfThese(NPCObj.inRoom, rooms)) {
        //     res({ NPCObj, message })
        // } else if (startsWithNPC && !thisStartsWithOneOfThese(NPCObj.inRoom, rooms)) {
        //     rej({ status: 404, message: '' })
        // } else {
        //     rej({ status: 204, message: "Doesn't start with NPC" })
        // }
    })

}

module.exports = NPCChecks;