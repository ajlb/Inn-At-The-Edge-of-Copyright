//used to store access level of users to protected areas

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let roleSchema = new Schema({
    role: {
        type: String
    },
    description: {
        type: String
    },
    users: {
        type: Array
    }
});

const Roles = mongoose.model("Roles", roleSchema);
module.exports = Roles;