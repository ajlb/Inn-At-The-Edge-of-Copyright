const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config()

const db = require("./models");
const router = express.Router();


mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;



/* API ROUTES */


router.route("/getData").get(function(req, res) {
  db.Action.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});







connection.once("open", function() {
    console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
  });

const PORT = 4000;
app.use(cors());
app.use("/", router);
app.listen(PORT, function() {
  console.log("\nServer is running on Port: " + PORT);
});