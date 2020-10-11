const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
    
    app.get('/', function(request, response) {
        response.render('index', {});
    });

    app.get("/play", isAuthenticated, function(req, res){
        res.render('play', {});
    });

};