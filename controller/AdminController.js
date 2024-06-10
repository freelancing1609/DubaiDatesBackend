const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/Admin');
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require('../utils/jwtToken');
const { isAdmin } = require('../middleware/admin');

// Register a new admin 
router.post('/register', isAdmin,async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return next(new ErrorHandler("Admin already exists", 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save admin data
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        });
        const admin = await newAdmin.save();

        // Generate JWT token
        const token = admin.getJwtToken();

        res.status(201).json({ success: true, admin, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login an admin
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        // Generate JWT token
        sendToken(admin, 200, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/protected-route', isAdmin, (req, res) => {
    // Access req.user to get user info
    res.status(200).json({ message: 'Access granted', admin: req.admin });
});



module.exports = router;
