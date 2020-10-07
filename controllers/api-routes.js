const express = require("express");
const handlebars = require("express-handlebars");
const { json } = require("sequelize");
const models = require("../models");


module.exports = function (app) {
    app.get("/api/locations/:id", function(req, res){
        models.location.findOne({where: {id: req.params.id}}).then(function(data){
            res.json(data);
        })
    })
};
