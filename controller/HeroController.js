const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload'); // Import the upload middleware
const Heros = require('../model/Hero'); // Import your Hero model


// Define the route to create a Hero
router.post('/create', isAdmin, upload.single('image'), async (req, res, next) => {
    const { hero_name } = req.body;
    try {
        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        // Get the image URL from Cloudinary
        const imageUrl =  req.file.path;
        // console.log(imageUrl)
        // Create a new Hero object
        const newHero = new Heros({
            hero_name,
            hero_image: imageUrl // Save the image URL to the database
        });

        // Save the Hero to the database
        const Hero = await newHero.save();

        // Send response
        res.status(201).json({ success: true, Hero });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
router.get('/hero',async (req, res, next) => {
    try {
        // Fetch all categories from the database
        const hero = await Heros.find();

        // Send response with Hero data
        res.status(200).json({ success: true, hero });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
// Define the route to update a Hero
router.put('/update/:HeroId', isAdmin, upload.single('image'), async (req, res, next) => {
    const { hero_name } = req.body;
    const { HeroId } = req.params;
    try {
        // Find the Hero by ID
        let Hero = await Heros.findById(HeroId);

        if (!Hero) {
            return res.status(404).json({ success: false, message: 'Hero not found' });
        }

        // Update Hero fields
        Hero.hero_name = hero_name;
        

        // Update Hero image if new image is provided
        if (req.file) {
            Hero.hero_image = req.file.path; // Update image URL
        }

        // Save the updated Hero to the database
        Hero = await Hero.save();

        // Send response
        res.status(200).json({ success: true, Hero });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:HeroId', isAdmin, async (req, res, next) => {
    const { HeroId } = req.params;
    try {
        // Find the Goals by ID and delete it
        let hero = await Heros.findByIdAndDelete(HeroId);

        if (!hero) {
            return res.status(404).json({ success: false, message: 'hero not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'hero  deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
