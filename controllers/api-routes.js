const express = require("express");
const handlebars = require("express-handlebars");
const { json } = require("sequelize");
const models = require("../models");
const item = require("../models/item");


module.exports = function (app) {
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
    //find player data
    app.get("/api/players/:name", function(req, res){
        models.player.findOne({where: {characterName:req.params.name}}).then(function(data){
            res.json(data);
        }).catch(function(e){
            console.log(e)
        });
    });
};
