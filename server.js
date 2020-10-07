const express = require("express");
const handlebars = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));


require("./controllers/view-routes.js")(app);
require("./controllers/api-routes.js")(app);


db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});