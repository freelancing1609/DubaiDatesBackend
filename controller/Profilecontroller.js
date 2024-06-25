const express = require('express');
const router = express.Router();
const User = require('../model/User');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const ErrorHandler = require("../utils/ErrorHandler");
const {updateProfile}   = require('../utils/Privilege')
// Update profile route
router.put('/update-profile', isAuthenticated(['customer'],[updateProfile]), async (req, res) => {
    try {
        // Extract user ID from authenticated request
        const userId = req.user._id;

        // Extract updated profile data from request body
        const { name, email, dateOfBirth, gender } = req.body;

        // Find the user by ID in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(new ErrorHandler("user not exist", 404));
        }

        // Update user's profile information (excluding phone number)
        user.name = name || user.name;
        user.email = email || user.email;
        user.dateOfBirth = new Date(dateOfBirth);
        user.gender = gender || user.gender;

        // Save the updated user object
        await user.save();

        // Respond with the updated user object
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
