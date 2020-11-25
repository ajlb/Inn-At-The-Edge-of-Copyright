const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const server = require('http').createServer(app);
const mongoose = require("mongoose");
const db = require("./models");
const dotenv = require("dotenv").config();
const cors = require("cors");
const backEngine = require("./controllers/backEngine");
const APIBackroutes = require("./routes/API/backEngineAPI");
const APIroutes = require("./routes/API/APIroutes");
const APIadminRoutes = require("./routes/API/adminAPI");

// creating the io variable via the config folder
const io = require('./config/io-config')(server);
// setting all the server listeners
require('./controllers/socketController')(io);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

/* API ROUTES */

app.use("/backAPI", APIBackroutes);
app.use("/frontAPI", APIroutes);
app.use("/adminAPI", APIadminRoutes);

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/innattheedge", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
const connection = mongoose.connection;



// log once mongoDB is open
connection.once("open", function () {
  console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
});

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
