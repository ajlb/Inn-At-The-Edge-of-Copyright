const db = require('../models')

// 
// ALL QUEST FUNCTIONS MUST RETURN A PROMISE
// 

function assignAndUpdatePlayerQuest(io, socket, { user, questTitle, newObjectiveRef }) {
    return new Promise((res, rej) => {
        try {
            db.Quest.findOne({ title: questTitle })
                .then(data => {
                    data = data.toJSON();
                    let newObjective = data.objectives.find(obj => obj.reference === newObjectiveRef);
                    let newObjectiveIndex = data.objectives.indexOf(newObjective);
                    let completed = data.objectives.length - 1 === newObjectiveIndex
                    user.quests.push({ title: questTitle, newObjectiveRef, completed })

                    if (newObjective.giveToken) {
                        let hasToken = false;
                        user.tokens.forEach(token => {
                            if (token.name === newObjective.giveToken) hasToken = true;
                        })
                        if (!hasToken) {
                            user.tokens.push({ name: newObjective.giveToken, quantity: 1 })
                        } else {
                            let index = user.tokens.findIndex(tok => tok.name === newObjective.giveToken)
                            user.tokens[index].quantity++
                        }
                    }

                    if (newObjective.takeToken) {
                        let hasToken = false;
                        user.tokens.forEach(token => {
                            if (token.name === newObjective.takeToken) hasToken = true;
                        })
                        if (hasToken) {
                            user.tokens.splice(user.tokens.indexOf(newObjective.takeToken), 1)
                        }
                    }

                    db.Player.findOneAndUpdate(
                        { characterName: user.characterName },
                        { quests: user.quests, tokens: user.tokens },
                        { new: true }
                    )
                        .then(({ quests, tokens }) => {
                            io.to(socket.id).emit("questsUpdate", { quests, tokens })
                            if (completed) {
                                io.to(socket.id).emit('questNotif', `Quest Completed: ${questTitle}`)
                            } else {
                                io.to(socket.id).emit('questNotif', `New Quest: ${questTitle}`)
                            }
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

function updatePlayerQuest(io, socket, { user, questTitle, newObjectiveRef }) {
    return new Promise((res, rej) => {
        try {
            let hasAlreadyAchieved = false;
            user.quests.forEach(quest => {
                if (quest.objectiveReference === newObjectiveRef) hasAlreadyAchieved = true
            })
            if (hasAlreadyAchieved) {
                io.to(socket.id).emit('failure', "You have already achieved this objective!")
            }

            !hasAlreadyAchieved && db.Quest.findOne({ title: questTitle })
                .then((questObj) => {
                    questObj = questObj.toJSON();
                    let newObjective = questObj.objectives.find(obj => obj.reference === newObjectiveRef);
                    let newObjIndex = questObj.objectives.indexOf(newObjective);
                    let completed = newObjIndex >= questObj.objectives.length - 1;
                    let updatedPlayerQuest = {
                        title: questTitle,
                        objectiveReference: newObjective.reference,
                        completed
                    }
                    user.quests = user.quests.map(quest => {
                        if (quest.title = questTitle) return updatedPlayerQuest
                        else return quest
                    })

                    if (newObjective.giveToken) {
                        let alreadyHasToken = false;
                        user.tokens.forEach(token => {
                            if (token.name === newObjective.giveToken) alreadyHasToken = true;
                        })
                        if (!alreadyHasToken) {
                            user.tokens.push({ name: newObjective.giveToken, quantity: 1 })
                        } else {
                            let index = user.tokens.findIndex(tok => tok.name === newObjective.giveToken)
                            user.tokens[index].quantity++
                        }
                    }

                    if (newObjective.takeToken) {
                        let hasToken = false;
                        user.tokens.forEach(token => {
                            if (token.name === newObjective.takeToken) hasToken = true;
                        })
                        if (hasToken) {
                            user.tokens.splice(user.tokens.indexOf(newObjective.takeToken), 1)
                        }
                    }

                    db.Player.findOneAndUpdate(
                        { characterName: user.characterName },
                        { quests: user.quests, tokens: user.tokens },
                        { new: true }
                    )
                        .then(({ quests, tokens }) => {
                            io.to(socket.id).emit("questsUpdate", { quests, tokens })
                            if (completed) {
                                io.to(socket.id).emit('questNotif', `Quest Completed: ${questTitle}`)
                            } else {
                                io.to(socket.id).emit('questNotif', `Quest Update: ${questTitle}`)
                            }
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

module.exports = { assignAndUpdatePlayerQuest, updatePlayerQuest, incrementPlayerQuest }