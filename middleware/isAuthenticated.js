const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/User");

exports.isAuthenticated = (requiredRoles = [], requiredPermissions = []) => async (req, res, next) => {
    // Get token from headers or query params or cookies
    const token = req.headers.authorization;

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Admins bypass all checks
        if (req.user.roles.includes('admin')) {
            return next();
        }

        // Check if required roles are specified and validate user roles
        const hasRequiredRoles = requiredRoles.length === 0 || requiredRoles.some(role => req.user.roles.includes(role));
        
        // Check if required permissions are specified and validate user permissions
        const hasRequiredPermissions = requiredPermissions.length === 0 || checkPermissions(req.user, requiredPermissions);

        if (!hasRequiredRoles && !hasRequiredPermissions) {
            return next(new ErrorHandler("Insufficient roles or permissions", 403));
        }

        next();
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Invalid token", 401));
    }
};

function checkPermissions(user, requiredPermissions) {
    // Implement your logic to check if user has requiredPermissions
    // Example logic:
    const userPermissions = user.permissions || []; // Assuming you have permissions field in User model
    return requiredPermissions.every(permission => userPermissions.includes(permission));
}
