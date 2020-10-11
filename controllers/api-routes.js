const express = require("express");
const handlebars = require("express-handlebars");
const { json, Sequelize } = require("sequelize");
const models = require("../models");
const item = require("../models/item");
const Op = Sequelize.Op;
const passport = require("../config/passport");

module.exports = function (app) {
    //log in
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        console.log("You signed in!");
        res.json(req.player);
    });

    //sign up
    app.post("/api/signup", function(req, res){
        models.player.create(req.body).then(function(){
            console.log("You signed up!");
            res.status(307).json(data);
        }).catch(e=>res.status(401).json(e))
    });

    //log out
    app.get("/logout", function(req, res){
        req.logout();
        console.log("Logged out?");
    });

    //find location based on id
    app.get("/api/locations/:id", function(req, res){
        models.location.findOne({where: {id: req.params.id}}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e)
        });
    });
    //find all actions (to be used once at page init, data written to variable)
    app.get("/api/actions/", function(req, res){
        models.action.findAll({}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e)
        });
    });
    //find one action matching action name
    app.get("/api/actions/:actionName", function(req, res){
        models.action.findOne({where: {actionName: req.params.actionName}}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e)
        });
    });
    //get inventory for Player, Location, or Item
    app.get("/api/inventory/:locatorID", function(req, res){
        models.inventory.findAll({
            where: {
                locator_id:req.params.locatorID,
                currentlyEquipped: 0},
            include: {model: models.item}
        }).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e);
        });
    });
    //Update inventory quantity by amount specified
    app.put("/api/inventory/", function(req, res){
        let wheres = {
            locator_id: req.body.locator_id,
            itemId: req.body.itemId
        };
        models.inventory.increment(`quantity`, {
            where: wheres,
            by: req.body.change,
        }).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e);
        });
    });
    //delete all items with quantity: 0 and currentlyEquipped: False
    app.delete("/api/inventory/", function(req, res){
        models.inventory.destroy({where: {
            quantity:{[Op.lte]:0},
        }}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e);
        });
    });
    app.post('/api/inventory/', function(req, res){
        models.inventory.create(req.body).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e);
        });
    });
    //find player data
    app.get("/api/players/:name", function(req, res){
        models.player.findOne({where: {characterName:req.params.name}}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e)
        });
    });
    app.get("/api/items/:id", function(req, res){
        models.item.findOne({where: {itemName: req.params.id}}).then(function(data){
            res.json(data);
        }).catch(e=>console.log(e));
    })
};
