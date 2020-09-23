// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// Requiring passport as we've configured it
const passport = require("./config/passport");
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "/data");
// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");
// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

//setting handlebars as a new engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// app.get("/api/symbols", async function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   fs.createReadStream(path.resolve(dataPath, "symbol_search.json")).pipe(res);
// });

// app.get("/api/stocks", async function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   fs.createReadStream(path.resolve(dataPath, "company_stock.json")).pipe(res);
// });

// app.get("/api/details", async function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   fs.createReadStream(path.resolve(dataPath, "company_details.json")).pipe(res);
// });

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
