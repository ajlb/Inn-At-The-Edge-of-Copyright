const db = require('../models')

function handleTokens({ tokens, newObjective, io, socket }) {
    let { giveToken, takeToken } = newObjective;

    if (giveToken) {
        let foundToken = tokens.find(({ name }) => name === giveToken.name);
        let { name: toGive, quantity: numberGiven = 1 } = giveToken;
        if (!foundToken) tokens.push({ name: toGive, quantity: numberGiven });
        if (foundToken) tokens[tokens.indexOf(foundToken)].quantity += numberGiven;
        io.to(socket.id).emit(
            'genericMessage',
            `You collect ${numberGiven > 1 ? numberGiven : 'a'} ${toGive}${numberGiven > 1 ? 's' : ''}`
        );
    }

    if (takeToken) {
        let { quantity } = (foundToken = tokens.find(({ name }) => name === takeToken.name)) || { undefined };
        let { name: toTake, quantity: numberTaken = quantity } = takeToken;
        let index = tokens.indexOf(foundToken)
        if (quantity <= 0 | quantity == undefined) {
            tokens.splice(index, 1);
            io.to(socket.id).emit('failure', `You do not have any ${toTake}s`);
        }
        else if (foundToken && quantity >= numberTaken) {
            (tokens[index].quantity -= numberTaken) <= 0 ? tokens.splice(index, 1) : '';
            io.to(socket.id).emit(
                'genericMessage',
                `You lose ${numberTaken > 1 ? numberTaken : 'a'} ${toTake}${numberTaken > 1 ? 's' : ''}`
            )
        }
        else if (foundToken && quantity < numberTaken) io.to(socket.id).emit('failure', `You do not have enough ${toTake}s`);
    }

    return tokens;
}

// 
// ALL QUEST FUNCTIONS MUST RETURN A PROMISE
//

function assignQuest(io, socket, { user: { quests, tokens, characterName }, questTitle }) {
    return new Promise((res, rej) => {
        try {
            let alreadyAssigned = quests.find(({ title }) => title === questTitle) ? true : false;
            if (alreadyAssigned) rej(`Quest ${questTitle} already assigned to user ${user.characterName}`);

            !alreadyAssigned && db.Quest.findOne({ title: questTitle })
                .then(data => {
                    let { title, objectives } = data.toJSON();
                    let newObjective = objectives[0];
                    quests.push({ title, objectiveReference: objectives[0].reference, completed: false });

                    tokens = handleTokens({ tokens, newObjective, io, socket })

                    db.Player.findOneAndUpdate({ characterName }, { quests, tokens }, { new: true })
                        .then(data => {
                            let { quests, tokens } = data.toJSON()
                            io.to(socket.id).emit('questsUpdate', { quests, tokens })
                            io.to(socket.id).emit('questNotif', `New Quest: ${questTitle}`)
                            res()
                        })
                        .catch(e => {
                            console.log('ERROR IN DB CALL', e)
                            io.to(socket.id).emit('failure', "Something went wrong")
                            rej(e)
                        });
                })
                .catch(e => {
                    console.log("EROR IN DB CALL", e)
                    rej(e)
                });
        } catch (e) {
            console.log("ERROR IN assignQuest:", e)
        };
    });
};

function assignAndUpdatePlayerQuest(io, socket, { user: { characterName, tokens, quests }, questTitle, newObjectiveRef }) {
    return new Promise((res, rej) => {
        try {
            db.Quest.findOne({ title: questTitle })
                .then(data => {
                    let { objectives } = data.toJSON();
                    let newObjective = objectives.find(obj => obj.reference === newObjectiveRef);
                    let newObjectiveIndex = objectives.indexOf(newObjective);
                    let completed = objectives.length - 1 === newObjectiveIndex;

                    quests.push({ title: questTitle, objectiveReference: newObjectiveRef, completed });

                    tokens = handleTokens({ tokens, newObjective, socket, io })

                    db.Player.findOneAndUpdate({ characterName }, { quests, tokens }, { new: true })
                        .then(({ quests, tokens }) => {
                            io.to(socket.id).emit("questsUpdate", { quests, tokens })
                            io.to(socket.id).emit('questNotif', (completed ? 'Quest Completed: ' : 'New Quest: ') + questTitle)
                            res()
                        })
                        .catch((e) => {
                            console.log("ERROR IN DB CALL", e)
                            io.to(socket.id).emit('failure', 'Something went wrong')
                            rej(e)
                        });
                })
                .catch(e => {
                    console.log("ERROR IN DB CALL", e)
                    io.to(socket.id).emit('failure', "Something went wrong")
                    rej(e)
                })
        } catch (e) {
            console.log('ERROR IN assignAndUpdatePlayerRequest', e)
            io.to(socket.id).emit('failure', "Something went wrong")
            rej(e)
        }
    })

}

function updatePlayerQuest(io, socket, { user: { quests, tokens, characterName }, questTitle, newObjectiveRef }) {
    return new Promise((res, rej) => {
        try {
            let hasAlreadyAchieved = false;
            quests.forEach(quest => {
                if (quest.objectiveReference === newObjectiveRef) hasAlreadyAchieved = true
            })
            if (hasAlreadyAchieved) {
                io.to(socket.id).emit('failure', "You have already achieved this objective!")
            }

            !hasAlreadyAchieved && db.Quest.findOne({ title: questTitle })
                .then((questObj) => {
                    let { objectives } = questObj.toJSON();
                    let newObjective = objectives.find(obj => obj.reference === newObjectiveRef);
                    let newObjIndex = objectives.indexOf(newObjective);
                    let completed = newObjIndex >= objectives.length - 1;
                    let updatedPlayerQuest = {
                        title: questTitle,
                        objectiveReference: newObjective.reference,
                        completed
                    }
                    quests = quests.map(quest => {
                        if (quest.title = questTitle) return updatedPlayerQuest
                        else return quest
                    })

                    tokens = handleTokens({ tokens, newObjective, socket, io })

                    db.Player.findOneAndUpdate({ characterName }, { quests, tokens }, { new: true })
                        .then(({ quests, tokens }) => {
                            io.to(socket.id).emit("questsUpdate", { quests, tokens })
                            io.to(socket.id).emit('questNotif', (completed ? 'Quest Completed: ' : 'Quest Update: ') + questTitle)
                            res()
                        })
                        .catch((e) => {
                            console.log("ERROR IN DB CALL", e)
                            io.to(socket.id).emit('failure', "Something went wrong")
                            rej(e)
                        });

                })
                .catch((e) => {
                    console.log("ERROR IN DB CALL", e)
                    io.to(socket.id).emit('failure', "Something went wrong")
                    rej(e)
                });

        } catch (e) {
            console.log("ERROR IN updatePlayerQuest", e)
            io.to(socket.id).emit('failure', "Something went wrong")
            rej(e)
        }
    })

}

function incrementPlayerQuest(io, socket, { questToUpdate: { title, objectiveReference, completed }, user: { characterName, quests, tokens } }) {
    // 
    // Incomplete function: avoid using
    // 
    return new Promise((res, rej) => {
        try {
            !completed && db.Quest.findOne({ title }).then(data => {
                data = data.toJSON();
                let oldIndex = data.objectives.findIndex(objective => objective.reference === objectiveReference);
                let oldObjective = data.objectives[oldIndex];
                let newIndex = oldIndex + 1;
                let newObjective = data.objectives[newIndex];
                let completed = data.objectives.length - 1 === newIndex
                let updatedPlayerQuest = {
                    title,
                    objectiveReference: newObjective.reference,
                    completed
                }
                quests = quests.map(quest => {
                    if (quest.title === title) {
                        return updatedPlayerQuest
                    } else {
                        return quest
                    }
                })
                db.Player.findOneAndUpdate({ characterName }, { quests }, { new: true })
                    .then(({ quests }) => {
                        io.to(socket.id).emit('questsUpdate', { quests })
                        if (completed) {
                            io.to(socket.id).emit('completedQuest')
                        } else {
                            io.to(socket.id).emit('updatedQuest')
                        }
                        res()
                    })
                    .catch(e => {
                        console.log("ERROR IN DB CALL", e)
                        io.to(socket.id).emit('failure', 'Something went wrong')
                        rej(e)
                    })
            })
        } catch (e) {
            console.log("ERROR IN incremenetPlayerQuest", e)
            io.to(socket.id).emit('failure', 'Something went wrong')
            rej(e)
        }
    })
}

module.exports = { assignAndUpdatePlayerQuest, updatePlayerQuest, incrementPlayerQuest, assignQuest }