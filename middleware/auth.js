// middlewares/isAuthenticated.js
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    // Get token from headers or query params or cookies
    const token = req.headers.authorization;

    if (!token) {
        return res.status(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});


