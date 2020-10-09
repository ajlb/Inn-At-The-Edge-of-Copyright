const express = require("express");
const handlebars = require("express-handlebars");
const { json } = require("sequelize");
const models = require("../models");
const item = require("../models/item");


module.exports = function (app) {
    app.get("/api/locations/:id", function(req, res){
        models.location.findOne({where: {id: req.params.id}}).then(function(data){
            res.json(data);
        });
    });
    app.get("/api/actions/", function(req, res){
        models.action.findAll({}).then(function(data){
            res.json(data);
        });
    });
    app.get("/api/actions/:actionName", function(req, res){
        models.action.findOne({where: {actionName: req.params.actionName}}).then(function(data){
            res.json(data);
        });
    });
    app.get("/api/inventory/:locatorID", function(req, res){
        //insert logic for items inner join on item ID = inventory.item_id
        console.log("In api-routes: " + req.params.locatorID);
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
};
