const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require("./middleware/error");



app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('API is running...');
});




// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}


const user = require("./controller/userController");
const profile = require("./controller/Profilecontroller");
const admin = require("./controller/AdminController")
const category=require("./controller/CategoryController")
const flavour = require("./controller/FlavourController")
const goal = require("./controller/GoalController")
const hero = require("./controller/HeroController")
const footer = require("./controller/FooterController")
const promo = require("./controller/PromoController")

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/admin", admin);
app.use("/api/category", category);
app.use("/api/flavour", flavour);
app.use("/api/goal", goal);
app.use("/api/hero", hero);
app.use("/api/promo", promo);
app.use("/api/footer", footer);





app.use(ErrorHandler);
module.exports = app;
