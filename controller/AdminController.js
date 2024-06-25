const express = require('express');
const router = express.Router();
const User = require('../model/User');
const {isAuthenticated} = require("../middleware/isAuthenticated");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register',isAuthenticated(["admin"]), async (req, res, next) => {
    const {  email, password } = req.body;
    let {name,phoneNumber}=req.body

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("User already exists", 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(!name){
            name="Admin"
        }
        // Save user data
        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            roles: ['admin'], // Default to customer role if not specified
        });

        const user = await newUser.save();

        // Generate JWT token
        const token = user.getJwtToken();

        res.status(201).json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register a new user
router.post('/addStaff',isAuthenticated(["admin"]), async (req, res, next) => {
    const {  email, password, permissions } = req.body;
    let {name,phoneNumber}=req.body
    if(!name){
        name="Admin"
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("Staff already exists with this email", 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Save user data
        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            roles: ['staff'], // Default to customer role if not specified
            permissions:permissions
        });

        const user = await newUser.save();

        // Generate JWT token
        const token = user.getJwtToken();

        res.status(201).json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update user permissions
router.put('/updatePermissions/:userId', isAuthenticated(["admin"]), async (req, res, next) => {
    const userId = req.params.userId;
    const { permissions } = req.body;

    try {
        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Update user permissions
        user.permissions = permissions;

        // Save the updated user to the database
        user = await user.save();

        // Send response
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    
router.post('/login',async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (user==null) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        // Generate JWT token
        const token = user.getJwtToken();

        res.status(200).json({ success: true, user, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});
router.get('/protected-route', isAuthenticated(['admin']), (req, res) => {
    // Access req.user to get user info
    res.status(200).json({ message: 'Access granted', user: req.user });
});
module.exports = router;