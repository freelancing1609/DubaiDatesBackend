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

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/admin", admin);
app.use("/api/category", category);





app.use(ErrorHandler);
module.exports = app;
