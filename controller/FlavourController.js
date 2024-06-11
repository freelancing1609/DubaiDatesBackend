const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const Flavour = require('../model/Flavour'); // Import your Flavour model


// Define the route to create a flavour
router.post('/create', isAdmin, async (req, res, next) => {
    const { name } = req.body;
    try {
        // Create a new flavour object
        const newFlavour = new Flavour({
            name
        });

        // Save the flavour to the database
        const flavour = await newFlavour.save();

        // Send response
        res.status(201).json({ success: true, flavour });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to fetch all flavours
router.get('/get-flavours', async (req, res, next) => {
    try {
        // Fetch all flavours from the database
        const flavours = await Flavour.find();

        // Send response with flavour data
        res.status(200).json({ success: true, flavours });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to update a flavour
router.put('/update/:flavourId', isAdmin, async (req, res, next) => {
    const { name } = req.body;
    const { flavourId } = req.params;
    try {
        // Find the flavour by ID
        let flavour = await Flavour.findById(flavourId);

        if (!flavour) {
            return res.status(404).json({ success: false, message: 'Flavour not found' });
        }

        // Update flavour fields
        flavour.name = name;

        // Save the updated flavour to the database
        flavour = await flavour.save();

        // Send response
        res.status(200).json({ success: true, flavour });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to delete a flavour
router.delete('/delete/:flavourId', isAdmin, async (req, res, next) => {
    const { flavourId } = req.params;
    try {
        // Find the flavour by ID and delete it
        const flavour = await Flavour.findByIdAndDelete(flavourId);

        if (!flavour) {
            return res.status(404).json({ success: false, message: 'Flavour not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'Flavour deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
