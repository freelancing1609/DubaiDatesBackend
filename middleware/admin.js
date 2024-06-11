// middlewares/isAuthenticated.js
const jwt = require('jsonwebtoken');
const Admin= require("../model/Admin");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAdmin = catchAsyncErrors(async(req,res,next) => {
    // Get token from headers or query params or cookies
    const token = req.headers.authorization;
    if (!token) {
        return res.status(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET_KEY);
        
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(new ErrorHandler("User not found", 404));
    }
  req.admin = admin;

    next();
});


