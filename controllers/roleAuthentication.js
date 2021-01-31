const db = require("../models");

module.exports = function({ io, socket, authUser }){
    db.Roles.find({users:"authUser"}).select("role").then(results=>{
        results = results.map(obj => obj.role);
        if (results.length > 0) {
            console.log(`User has the following access privileges:`, results);
        } else {
            console.log('User has no access privileges.')
        }
        io.to(socket.id).emit("roleAuthentication", results);
    })
}