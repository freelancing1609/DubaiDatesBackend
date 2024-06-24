const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload'); 
const EnergySection = require('../model/EnergySection'); 

// Define the route to create an energy section
router.post('/create', isAdmin, upload.fields([{ name: 'energy_image', maxCount: 1 }, { name: 'energy_mobileImage', maxCount: 1 }]), async (req, res, next) => {
    const { energy_title, energy_subTitle, energy_description, energy_mobile_description } = req.body;
    try {
        // Check if both images are uploaded
        if (!req.files || !req.files.energy_image || !req.files.energy_mobileImage) {
            return res.status(400).json({ success: false, message: 'Both energy_image and energy_mobileImage are required' });
        }

        // Get the image URLs from Cloudinary
        const energyImageUrl = req.files.energy_image[0].path;
        const energyMobileImageUrl = req.files.energy_mobileImage[0].path;

        // Create a new energy section object
        const newEnergySection = new EnergySection({
            energy_title,
            energy_subTitle,
            energy_description,
            energy_mobile_description,
            energy_image: energyImageUrl, // Save the energy image URL to the database
            energy_mobileImage: energyMobileImageUrl // Save the energy mobile image URL to the database
        });

        // Save the energy section to the database
        const energySection = await newEnergySection.save();

        // Send response
        res.status(201).json({ success: true, energySection });
    } catch (error) {
        // Handle errors
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

// Define the route to get all energy sections
router.get('/get', async (req, res, next) => {
    try {
        // Fetch all energy sections from the database
        const energySections = await EnergySection.find();
        // Send response
        res.status(200).json({ success: true, energySections });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to update an energy section
router.put('/update/:id', 
    isAdmin, 
    upload.fields([{ name: 'energy_image', maxCount: 1 }, { name: 'energy_mobileImage', maxCount: 1 }]), 
    async (req, res, next) => {
        const { id } = req.params;
        const { energy_title, energy_subTitle, energy_description, energy_mobile_description } = req.body;
        try {
            // Find the energy section by ID
            const energySection = await EnergySection.findById(id);
            if (!energySection) {
                return res.status(404).json({ success: false, message: 'EnergySection not found' });
            }

            // Update energy section fields
            if (energy_title) energySection.energy_title = energy_title;
            if (energy_subTitle) energySection.energy_subTitle = energy_subTitle;
            if (energy_description) energySection.energy_description = energy_description;
            if (energy_mobile_description) energySection.energy_mobile_description = energy_mobile_description;

            // Check if new images are uploaded
            if (req.files && req.files.energy_image) {
                energySection.energy_image = req.files.energy_image[0].path;
            }
            if (req.files && req.files.energy_mobileImage) {
                energySection.energy_mobileImage = req.files.energy_mobileImage[0].path;
            }

            // Save the updated energy section to the database
            const updatedEnergySection = await energySection.save();

            // Send response
            res.status(200).json({ success: true, updatedEnergySection });
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: error.message });
        }
    }
);

// Define the route to delete an energy section
router.delete('/delete/:id', isAdmin, async (req, res, next) => {
    const { id } = req.params;
    try {
        // Find the energy section by ID and delete it
        const energySection = await EnergySection.findByIdAndDelete(id);

        if (!energySection) {
            return res.status(404).json({ success: false, message: 'EnergySection not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'EnergySection deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
