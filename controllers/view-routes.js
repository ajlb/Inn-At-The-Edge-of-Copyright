const passport = require("passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
    
    //log in
    app.post("/login", passport.authenticate("local"), function(req, res) {
        if (req.user) {
            console.log("YOU'VE LOGGED IN!");
            res.render("play", {});
            }
            res.render('index', {});
    });

    //log out
    app.get("/logout", function(req, res){
        req.logout();
        console.log("Logged out?");
    });
    
    app.get('/', function(req, res) {
        res.render('index', {});
    });

    app.get("/play", isAuthenticated, function(req, res){
        res.render('play', {});
    });
};