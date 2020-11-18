const router = require("express").Router();
const db = require("../../models");
const mongoose = require("mongoose");

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


module.exports = router;
