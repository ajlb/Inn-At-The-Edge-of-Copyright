const router = require("express").Router();
const db = require("../../models");
const mongoose = require("mongoose");

router.route("/playerTime")
  .get(function (req, res) {
    db.Player.findOne({ characterName: "Boomels" }).then(function (data) {
      res.json(data);
    }).catch(e => {
      console.log(e);
    })
  })
  .put(function ({ body: { day } }, res) {
    db.Player.updateOne({characterName: "Boomels"}, {$set: {"day": day}}).then(function(data){
      res.json(data)
    }).catch(e=>{
      console.log(e);
    })
  })


module.exports = router;
