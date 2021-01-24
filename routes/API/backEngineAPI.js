const router = require("express").Router();
const db = require("../../models");
const mongoose = require("mongoose");

// router.route("/playerTime")

//   .put(function ({ body: { day, playerName } }, res) {
//     db.Player.updateOne({characterName: playerName}, {$set: {"day": day}}).then(function(data){
//       res.json(data)
//     }).catch(e=>{
//       console.log(e);
//     })
//   })

// router.route("/playerTime/:characterName")
//   .get(function({ params: { characterName } }, res) {
//       db.Player.findOne({ characterName }).then(function (data) {
//         res.json(data);
//       }).catch(e => {
//         console.log(e);
//       })
//     })

module.exports = router;
