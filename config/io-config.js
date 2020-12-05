module.exports = function (server) {
    return require('socket.io')(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001", `nicksnpcs.herokuapp.com:*`, `inn-staging.herokuapp.com:*`, `innattheedge.herokuapp.com:*`, `innv2.herokuapp.com:*`],
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    })
}