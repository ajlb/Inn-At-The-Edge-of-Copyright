const express = require("express");
const handlebars = require("express-handlebars");
const { json, Sequelize } = require("sequelize");
const models = require("../models");
const item = require("../models/item");
const Op = Sequelize.Op;
const passport = require("../config/passport");

module.exports = function (app) {

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                characterName: req.user.characterName
            });
        }
    });
    //sign up
    app.post("/signup", function (req, res) {
        models.player.create(req.body).then(function (data) {
            console.log("You signed up!");
            res.json(data);
        }).catch(e => res.status(401).json(e))
    });
    //find all locations
    app.get("/api/locations/", function (req, res){
        models.location.findAll({}).then(function(data){
            res.json(data);
        }).catch(e=>console.log(e));
    });
    //find location based on id
    app.get("/api/locations/:id", function (req, res) {
        models.location.findOne({ where: { id: req.params.id } }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e)
        });
    });
    //find all actions (to be used once at page init, data written to variable)
    app.get("/api/actions/", function (req, res) {
        models.action.findAll({}).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e)
        });
    });
    //find one action matching action name
    app.get("/api/actions/:actionName", function (req, res) {
        models.action.findOne({ where: { actionName: req.params.actionName } }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e)
        });
    });
    //get inventory for Player, Location, or Item
    app.get("/api/inventory/:locatorID", function (req, res) {
        models.inventory.findAll({
            where: {
                locator_id: req.params.locatorID,
                currentlyEquipped: 0
            },
            include: { model: models.item }
        }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //get NPC dialogue by NPC name
    app.get("/api/dialog/:NPC", function (req, res) {
        models.dialog.findOne({ where: { NPC: req.params.NPC } })
            .then(data => {
                res.json(data);
            })
            .catch(e => {
                console.log(e)
                res.status(404);
            })
    })
    //Put item into player equipment slot
    app.put("/api/playerEquipment/", function (req, res) {
        let wheres = {
            id: req.body.characterId
        };
        let whats = {};
        whats[req.body.slotName] = req.body.itemId;
        console.log(whats);
        models.player.update(whats, {
            where: wheres,
        }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //Update inventory quantity by amount specified
    app.put("/api/inventory/quantity/", function (req, res) {
        let wheres = {
            locator_id: req.body.locator_id,
            itemId: req.body.itemId
        };
        models.inventory.increment(`quantity`, {
            where: wheres,
            by: req.body.change,
        }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //Update inventory currentlyEquipped by amount specified
    app.put("/api/inventory/isEquipped/", function (req, res) {
        let wheres = {
            locator_id: req.body.locator_id,
            itemId: req.body.itemId
        };
        models.inventory.increment(`currentlyEquipped`, {
            where: wheres,
            by: req.body.change,
        }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //delete all items with quantity: 0 and currentlyEquipped: False
    app.delete("/api/inventory/", function (req, res) {
        models.inventory.destroy({
            where: {
                quantity: { [Op.lte]: 0 },
            }
        }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //Put an item in inventory
    app.post('/api/inventory/', function (req, res) {
        models.inventory.create(req.body).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e);
        });
    });
    //find player data
    app.get("/api/players/:name", function (req, res) {
        models.player.findOne({ where: { characterName: req.params.name } }).then(function (data) {
            res.json(data);
        }).catch(function (e) {
            console.log(e)
        });
    });
    //get all items
    app.get("/api/items/", function(req, res){
        models.item.findAll({}).then(function(data){
            res.json(data);
        }).catch(e=>console.log(e));
    })
    //get item data by ID
    app.get("/api/items/:id", function (req, res) {
        models.item.findOne({ where: { itemName: req.params.id } }).then(function (data) {
            res.json(data);
        }).catch(e => console.log(e));
    });
    //get player's equipment data by player ID
    app.get("/api/playerEquipment/:id", function (req, res) {
        models.player.findOne({ attributes: ['headSlot', 'neckSlot', 'torsoSlot', 'rightHandSlot', 'leftHandSlot', 'legsSlot', 'feetSlot', 'ringSlot', 'handsSlot', 'twoHands'], where: { id: req.params.id } }).then(function (data) {
            res.json(data);
        }).catch(e => console.log(e));
    })
    // validate if player exists during sign up
    app.get("/api/validate/:name", function (req, res) {
        models.player.findOne({ where: { characterName: req.params.name } }).then(function (data) {
            if (data === null) {
                res.json("Available");
            } else {
                res.json("Taken");
            }
            // res.json(data);
        }).catch(function (e) {
            res.json("Error")
        });
    });
    //update player stats by amount locating by player name
    app.put("/api/playerStats/", function (req, res) {
        models.player.increment(req.body.stat, { where: { characterName: req.body.characterName }, by: req.body.amount }).then(function (data) {
            res.json(data);
        }).catch(e => reject(e));
    });
    //get player stats by player name
    app.get("/api/playerStats/:id", function (req, res) {
        models.player.findOne({ attributes: ['DEX', 'STR', 'WIS', 'HP', 'maxHP', 'level', 'xp'], where: { characterName: req.params.id } }).then(function (data) {
            res.json(data);
        }).catch(e => console.log(e));
    })
    //update player's last location by player name
    app.put("/api/playerLocation/", function (req, res) {
        models.player.update({ lastLocation: req.body.lastLocation }, { where: { characterName: req.body.characterName } }).then(function (data) {
            res.json(data);
        }).catch(e => reject(e));
    });
};
