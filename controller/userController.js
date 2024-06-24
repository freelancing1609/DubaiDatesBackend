const express = require('express');
const router = express.Router();
const User = require('../model/User');
const twilio = require('twilio');
const {isAuthenticated} = require("../middleware/isAuthenticated");
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require('bcryptjs');
const {updateProfile}   = require('../utils/Privilege')

// Twilio client initialization
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Send OTP for registration
router.post('/send-otp', async (req, res, next) => {
    const { phoneNumber } = req.body;
    const phoneNumberWithCountryCode = '+91' + phoneNumber;
    try {
        await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: phoneNumberWithCountryCode, channel: 'sms' });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/register', async (req, res, next) => {
    const { name, email, phoneNumber, otp } = req.body;
    const phoneNumberWithCountryCode = '+91' + phoneNumber;
    try {
        // Verify OTP
        const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumberWithCountryCode, code: otp });

        if (verification.status !== 'approved') {
            throw new Error('Invalid OTP');
        }
        const userphone = await User.findOne({ phoneNumber });

        if (userphone) {
          return next(new ErrorHandler("User already exists", 400));
        }
        // Save user data
        const newUser = new User({
            name,
            email,
            phoneNumber,
            roles: ['customer'],
        });
        const user = await newUser.save();

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/updateProfile/:userId', isAuthenticated(["customer"],[updateProfile]), async (req, res, next) => {
    const { name, email, gender,birth_date } = req.body;
    const userId = Number(req.params.userId); 
    try {
        // Find the user by ID
        let user = await User.findOne({_id:userId})
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (birth_date) user.birth_date = birth_date;
        // Save the updated user to the database
        user = await user.save();

        // Send response
        res.status(200).json({ success: true, user });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});


// Login with OTP
router.post('/login', async (req, res, next) => {
    const { phoneNumber, otp } = req.body;
    const phoneNumberWithCountryCode = '+91' + phoneNumber;
    try {
        // Verify OTP
        const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumberWithCountryCode, code: otp });

            if (verification.status !== 'approved') {
            throw new Error('Invalid OTP');
        }
        const user = await User.findOne({ phoneNumber })

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
          }

        // Authenticate user (you can generate JWT here if needed)
        sendToken(user, 200, res);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

router.get('/alluser', async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
