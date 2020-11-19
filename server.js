const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const db = require("./models");
const dotenv = require("dotenv").config()
const cors = require("cors");
const backEngine = require("./controllers/backEngine");
const APIBackroutes = require("./routes/API/backEngineAPI");
const APIroutes = require("./routes/API/APIroutes");
const APIadminRoutes = require("./routes/API/adminAPI");


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
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
const connection = mongoose.connection;


//log once mongoDB is open
connection.once("open", function() {
  console.log("\nConnected to mongoose\n\n--------------begin log--------------\n");
});


// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
