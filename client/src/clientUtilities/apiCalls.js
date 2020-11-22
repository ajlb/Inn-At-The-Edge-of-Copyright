//FUNCTIONS THAT INTERFACE DIRECTLY WITH API ROUTES

function getLocation(locationID) {
    return new Promise(function (resolve, reject) {
        $.get("/api/locations/" + locationID, function (data) {
            resolve(data);
        });
    });
}

function getAllLocations() {
    return new Promise(function(resolve, reject){
        $.get("/api/locations/", function(data){
            resolve(data);
        });
    });
}

function getDialog(NPC) {
    return new Promise((resolve, reject) => {
        $.get("/api/dialog/" + NPC, (data) => {
            resolve(data);
        })
    })
}

function getAction(actionName) {
    return new Promise(function (resolve, reject) {
        $.get("/api/actions/" + actionName, function (data) {
            resolve(data);
        });
    });
}

function getActions() {
    return new Promise(function (resolve, reject) {
        $.get("/api/actions/", function (data) {
            resolve(data);
        })
    })
}

function getInventory(idString) {
    return new Promise(function (resolve, reject) {
        $.get("/api/inventory/" + idString, function (data) {
            resolve(data);
        });
    });
}

function getPlayerData(playerName) {
    return new Promise(function (resolve, reject) {
        $.get("/api/players/" + playerName, function (data) {
            resolve(data);
        }).catch(e => {
            reject(e);
        })
    });
}

function changeItemQuantity(item, location, amount) {
    return new Promise(function (resolve, reject) {
        let queryBody = { locator_id: location, itemId: parseInt(item), change: amount };
        $.ajax({
            url: '/api/inventory/quantity/',
            method: 'PUT',
            data: queryBody,
        }).then(function (data) {
            resolve(data)
        });
    });
}

function fillPlayerInvSlot(item, player, slot) {
    return new Promise(function (resolve, reject) {
        let queryBody = {
            characterId: player,
            slotName: slot,
            itemId: item
        };
        $.ajax({
            url: '/api/playerEquipment/',
            method: 'PUT',
            data: queryBody,
        }).then(function (data) {
            resolve(data)
        });
    });
}

function changeIsEquipped(item, location, amount) {
    return new Promise(function (resolve, reject) {
        let queryBody = { locator_id: location, itemId: parseInt(item), change: amount };
        $.ajax({
            url: '/api/inventory/isEquipped/',
            method: 'PUT',
            data: queryBody,
        }).then(function (data) {
            resolve(data)
        });
    });
}

function scrubInventory() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/api/inventory/',
            method: 'DELETE'
        }).then(function (data) {
            resolve(data);
        })
    })
}

function findAllItems() {
    return new Promise(function (resolve, reject) {
        $.get("api/items/", function(data){
            resolve(data);
        });
    });
}

function findItemData(itemName) {
    return new Promise(function (resolve, reject) {
        $.get("api/items/" + itemName, function (data) {
            resolve(data);
        });
    });
}

function addItemToInventory(item, location, amount) {
    let newInvObject = {
        locator_id: location,
        itemId: item,
        quantity: amount,
        currentlyEquipped: 0
    }
    return new Promise(function (resolve, reject) {
        $.post('/api/inventory/', newInvObject, function (data) {
            resolve(data);
        });
    });
}

function loginPlayer(characterName, password) {
    console.log("You're in loginPlayer");
    $.post("/login", { characterName: characterName, password: password }).then(function (data) {
        window.location.replace("/play");
    }).catch(e => {
        console.log(e);
        window.location.replace("/play")
    });
}

function signupPlayer(name, password, stats, race, profession) {
    console.log(`creating ${name} with ${stats}`);
    let newCharObject = {
        characterName: name,
        password: password,
        WIS: stats.wis,
        DEX: stats.dex,
        STR: stats.str,
        HP: stats.hp,
        race: race,
        class : profession,
        lastLocation: 1002,
        description: `${ name } is a ${ race } ${ profession }`
    }
    return new Promise(function (resolve, reject) {
        $.post('/signup', newCharObject, function (data) {
            console.log(data);
            loginPlayer(newCharObject.characterName, newCharObject.password);
            resolve();
        }).catch(e => {
            console.log(e);
            loginPlayer(newCharObject.characterName, newCharObject.password);
            resolve(e);
        });
    });
}

function getPlayerFromLoginInfo() {
    return new Promise(function (resolve, reject) {
        $.get("/api/user_data").then(function (data) {
            resolve(data);
        }).catch(e => reject(e));
    })
}

function locateEquippedItems(playerId) {
    return new Promise(function (resolve, reject) {
        $.get("/api/playerEquipment/" + playerId).then(function (data) {
            resolve(data);
        }).catch(e => reject(e));
    })
}

function incrementStat(stat, amount, characterName) {
    return new Promise(function (resolve, reject) {
        let queryBody = { stat: stat, amount: amount, characterName: characterName };
        $.ajax({
            url: "/api/playerStats/",
            method: "PUT",
            data: queryBody
        }).catch(e => reject(e));
    });
}

function getStats(userName) {
    return new Promise(function (resolve, reject) {
        $.get("/api/playerStats/" + userName).then(function (data) {
            resolve(data);
        }).catch(e => reject(e));
    });
}

function rememberLocation(userName, locationId) {
    return new Promise(function (resolve, reject) {
        let queryBody = { characterName: userName, lastLocation: parseInt(locationId) };
        $.ajax({
            url: "/api/playerLocation/",
            method: "PUT",
            data: queryBody,
        }).then(function (data) {
            resolve(data);
        }).catch(e => reject(e));
    });
}

function whosOnline() {
    return new Promise(function (resolve, reject) {
        channel = 'oo-chat-' + currentLocation.locationName.replace(/ /g, "-");
        pubnub.hereNow(
            {
                channels: [channel],
                includeState: true
            },
            function (status, response) {
                console.log(response);
                resolve(response);
            }
        );
    })
}