const express = require("express");
const handlebars = require("express-handlebars");
const PubNub = require('pubnub');
const session = require("express-session");
const passport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat", resave:true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/scripts', express.static(__dirname + '/node_modules/pluralize/'));
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));


require("./controllers/view-routes.js")(app);
require("./controllers/api-routes.js")(app);
// require("./controllers/pubnub.js");


db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});