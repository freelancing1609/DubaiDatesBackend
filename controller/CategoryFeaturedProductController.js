const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const CategoryFeaturedProduct = require('../model/CategoryFeaturedProduct');
const Category = require('../model/Category'); // Import your Category model
const {isAuthenticated}=require("../middleware/isAuthenticated")
const {createCategoryFeaturedProduct,updateCategoryFeaturedProduct}=require("../utils/Privilege")
// Create a category featured product
router.post('/create', isAuthenticated(["admin"],[createCategoryFeaturedProduct]), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), async (req, res) => {
    const { title, subtitle, category } = req.body;
    try {
        // Check if both images are uploaded
        if (!req.files || !req.files.image || !req.files.mobileImage) {
            return res.status(400).json({ success: false, message: 'Both image and mobileImage are required' });
        }

        // Get the image URLs from Cloudinary
        const imageUrl = req.files.image[0].path;
        const mobileImageUrl = req.files.mobileImage[0].path;

        // Find category ID based on category name
            const categoryObj = await Category.findOne({ name: { $regex: new RegExp(category, 'i') } });

            if (!categoryObj) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            // Create a new category featured product object
            const newFeaturedProduct = new CategoryFeaturedProduct({
                title,
                subtitle,
                category: categoryObj._id, // Save the category ID to the database
                image: imageUrl, // Save the image URL to the database
                mobileImage: mobileImageUrl // Save the mobile image URL to the database
            });

        // Save the category featured product to the database
        const savedFeaturedProduct = await newFeaturedProduct.save();

        // Send response
        res.status(201).json({ success: true, featuredProduct: savedFeaturedProduct });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
// Update a category featured product
router.put('/update/:id', isAuthenticated(["admin"],[updateCategoryFeaturedProduct]), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { title, subtitle } = req.body;
    try {
        // Find the category featured product by ID
        let featuredProduct = await CategoryFeaturedProduct.findById(id);

        if (!featuredProduct) {
            return res.status(404).json({ success: false, message: 'Category featured product not found' });
        }

        // Update the category featured product with the new data
        featuredProduct.title = title;
        featuredProduct.subtitle = subtitle;

        // Check if images are uploaded
        if (req.files && req.files.image && req.files.mobileImage) {
            // Get the image URLs from Cloudinary
            const imageUrl = req.files.image[0].path;
            const mobileImageUrl = req.files.mobileImage[0].path;
            featuredProduct.image = imageUrl;
            featuredProduct.mobileImage = mobileImageUrl;
        }

        // Save the updated category featured product
        featuredProduct = await featuredProduct.save();

        // Send response
        res.status(200).json({ success: true, featuredProduct });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});


// Get all category featured products
router.get('/get', async (req, res) => {
    try {
        const featuredProducts = await CategoryFeaturedProduct.find();
        res.status(200).json({ success: true, featuredProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/by-category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Find products by category ID
        const products = await CategoryFeaturedProduct.find({ category: categoryId });

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this category' });
        }

        // Send response with products
        res.status(200).json({ success: true, products });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
