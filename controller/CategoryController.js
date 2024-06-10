const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload'); // Import the upload middleware
const Category = require('../model/Category'); // Import your Category model
const { isAuthenticated } = require('../middleware/auth');

// Define the route to create a category
router.post('/create', isAdmin, upload.single('image'), async (req, res, next) => {
    const { name, cat_description } = req.body;
    try {
        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        // Get the image URL from Cloudinary
        const imageUrl =  req.file.path;
        console.log(imageUrl)
        // Create a new category object
        const newCategory = new Category({
            name,
            cat_description,
            cat_image: imageUrl // Save the image URL to the database
        });

        // Save the category to the database
        const category = await newCategory.save();

        // Send response
        res.status(201).json({ success: true, category });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
router.get('/categories', isAuthenticated,async (req, res, next) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find();

        // Send response with category data
        res.status(200).json({ success: true, categories });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
// Define the route to update a category
router.put('/update/:categoryId', isAdmin, upload.single('image'), async (req, res, next) => {
    const { name, cat_description } = req.body;
    const { categoryId } = req.params;
    try {
        // Find the category by ID
        let category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Update category fields
        category.name = name;
        category.cat_description = cat_description;

        // Update category image if new image is provided
        if (req.file) {
            category.cat_image = req.file.path; // Update image URL
        }

        // Save the updated category to the database
        category = await category.save();

        // Send response
        res.status(200).json({ success: true, category });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
