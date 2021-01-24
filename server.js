const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const server = require('http').createServer(app);
const router = express.Router();
const mongoose = require("mongoose");
const db = require("./models");
require("dotenv").config();

const cors = require("cors");
const routes = require("./routes");
const APIBackroutes = require("./routes/API/backEngineAPI");
const APIroutes = require("./routes/API/APIroutes");
const APIadminRoutes = require("./routes/API/adminAPI");
const enforce = require('express-sslify');
// creating the io variable via the config folder
const io = require('./config/io-config')(server);
// setting all the server listeners
require('./controllers/socketController')(io);
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// console.log('heroku needed a change');
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
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
mongoose.set('useFindAndModify', false);
const connection = mongoose.connection;
// log once mongoDB is open
connection.once("open", function () {
  console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
});

// Defines all routes
app.use(routes);

server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
