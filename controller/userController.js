const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const twilio = require('twilio');
const {isAuthenticated} = require("../middleware/auth");
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require("../utils/ErrorHandler");

// Twilio client initialization
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

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

// Register a new user
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
            phoneNumber
        });
        const user = await newUser.save();

        res.status(201).json({ success: true, user });
    } catch (error) {
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
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/protected-route/user', isAuthenticated, (req, res) => {
    // Access req.user to get user info
    res.status(200).json({ message: 'Access granted', user: req.user });
});


module.exports = router;
