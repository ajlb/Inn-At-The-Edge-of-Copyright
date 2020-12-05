const router = require("express").Router();
const db = require("../../models");
const mongoose = require("mongoose");
const { response } = require("express");

router.route("/getData")
    .get(function(req, res) {
    db.Action.find({}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });

router.route("/checkCharacterName/:name")
  .get(function(req, res){
    db.Player.find({characterNameLowerCase: req.params.name}).select("characterName").then(data => {
      res.send(data);
    })
  })



module.exports = router;
