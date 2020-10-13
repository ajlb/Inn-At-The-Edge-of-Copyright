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
        models.player.create(req.body).then(function () {
            console.log("You signed up!");
            res.redirect(307, "/play");
        }).catch(e => res.status(401).json(e))
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
    app.get("/api/items/:id", function (req, res) {
        models.item.findOne({ where: { itemName: req.params.id } }).then(function (data) {
            res.json(data);
        }).catch(e => console.log(e));
    });
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
};
