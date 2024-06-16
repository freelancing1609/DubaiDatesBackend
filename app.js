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
const categoryFeaturedProduct = require("./controller/CategoryFeaturedProductController");
const address = require("./controller/AddressController")
const partner = require("./controller/PartnerController")
const order = require("./controller/OrderController")
const product = require("./controller/ProductController")
const productreview = require("./controller/ProductReviewController")
const search = require("./controller/SearchController")
const coupon = require("./controller/couponController")

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/admin", admin);
app.use("/api/category", category);
app.use("/api/flavour", flavour);
app.use("/api/goal", goal);
app.use("/api/hero", hero);
app.use("/api/promo", promo);
app.use("/api/category/feature", categoryFeaturedProduct);
app.use("/api/footer", footer);
app.use("/api/address", address);
app.use("/api/partner", partner);
app.use("/api/product", product);
app.use("/api/productreview", productreview);
app.use("/api/search", search);
app.use("/api/coupon", coupon);
app.use("/api/order",order);



app.use(ErrorHandler);
module.exports = app;
