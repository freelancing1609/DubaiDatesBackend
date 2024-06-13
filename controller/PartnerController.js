const express = require('express');
const router = express.Router();
const Partner = require('../model/Partner');

// Create a partner
router.post('/create', async (req, res) => {
    try {
        const { name, phoneNumber, email } = req.body;
        const partner = new Partner({ name, phoneNumber, email });
        await partner.save();
        res.status(201).json(partner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all partners
router.get('/get-partners', async (req, res) => {
    try {
        const partners = await Partner.find();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
