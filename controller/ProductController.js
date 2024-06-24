const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const mongoose = require('mongoose');
const Category = require('../model/Category');
const Flavour = require('../model/Flavour');
const upload = require('../middleware/upload');
const Goal = require('../model/Goals');
const { isAdmin } = require('../middleware/admin');

// Create a product with image uploads
router.post('/create',isAdmin, upload.fields([
    { name: 'product_image', maxCount: 1 },
    { name: 'product_slide_image', maxCount: 1 },
    { name: 'product_promo_banner_image', maxCount: 1 },
    { name: 'product_video_image', maxCount: 1 },
    { name: 'product_creative_image', maxCount: 1 }
]), async (req, res) => {
    try {
        const { 
            name,
            weight,
            weight_type,
            sku,
            sale_price,
            mrp,
            tax_type_tag,
            stock_levels,
            product_description,
            product_overview,
            product_benefits,
            product_ingredients,
            product_details,
            product_categories,
            product_falvours,
            product_goal
        } = req.body;
        // Upload images to Cloudinary and get URLs
        if (!req.files || !req.files.product_image || !req.files.product_slide_image || !req.files.product_promo_banner_image || !req.files.product_video_image || !req.files.product_creative_image) {
            return res.status(400).json({ success: false, message: 'images are required' });
        }
       

    // Convert category IDs to ObjectId
    const categoriesID = product_categories;
    const flavours = product_falvours;
    const goals = product_goal;

    // Validate category IDs and fetch category details
    const categories = await Category.find({ _id: { $in: categoriesID } });
    const falvours = await Flavour.find({ _id: { $in: flavours } });
    const goal = await Goal.find({ _id: { $in: goals } });

    if (categories.length !== product_categories.length) {
        return res.status(400).json({ success: false, message: 'Invalid category IDs provided' });
    }
    if (falvours.length !== product_falvours.length) {
        return res.status(400).json({ success: false, message: 'Invalid falvour IDs provided' });
    }
    if (goal.length !== product_goal.length) {
        return res.status(400).json({ success: false, message: 'Invalid goal IDs provided' });
    }

    // Create an array of category objects containing necessary details
    const categoryDetails = categories.map(category => ({
        id: category._id,
        name: category.name,
        // Add other fields as needed (description, etc.)
    }));
    const flavourDetails = falvours.map(falvours => ({
        id: falvours._id,
        name: falvours.name,
        // Add other fields as needed (description, etc.)
    }));
    const goalDetails = goal.map(goal => ({
        id: goal._id,
        name: goal.name,
        // Add other fields as needed (description, etc.)
    }));
        // Get the image URLs from Cloudinary
        const productImage = req.files.product_image ? req.files.product_image[0].path : null;
        const productSlideImage = req.files.product_slide_image ? req.files.product_slide_image[0].path : null;
        const productBanner = req.files.product_promo_banner_image ? req.files.product_promo_banner_image[0].path : null;
        const productVideoImage = req.files.product_video_image ? req.files.product_video_image[0].path : null;
        const productCreative = req.files.product_creative_image ? req.files.product_creative_image[0].path : null;
        const product = new Product({
            name,
            weight,
            weight_type,
            sku,
            sale_price,
            mrp,
            tax_type_tag,
            stock_levels,
            product_image: productImage,
            product_slide_image: productSlideImage,
            product_promo_banner_image: productBanner,
            product_video_image: productVideoImage,
            product_creative_image: productCreative,
            product_description,
            product_overview,
            product_benefits,
            product_ingredients,
            product_details,
            product_categories: categoryDetails,
            product_falvours: flavourDetails,
            product_goal: goalDetails
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.put('/update/:productId', isAdmin, upload.fields([
    { name: 'product_image', maxCount: 1 },
    { name: 'product_slide_image', maxCount: 1 },
    { name: 'product_promo_banner_image', maxCount: 1 },
    { name: 'product_video_image', maxCount: 1 },
    { name: 'product_creative_image', maxCount: 1 }
]), async (req, res) => {
    try {
        const { 
            name,
            weight,
            weight_type,
            sku,
            sale_price,
            mrp,
            tax_type_tag,
            stock_levels,
            product_description,
            product_overview,
            product_benefits,
            product_ingredients,
            product_details,
            product_categories,
            product_falvours,
            product_goal
        } = req.body;

        // // Validate category IDs, flavour IDs, and goal IDs
        // if (!Array.isArray(product_categories,product_falvours,product_goal)) {
        //     return res.status(400).json({ success: false, message: 'product_categories product_goal product_falvours must be an array' });
        // }

        // Convert category IDs, flavour IDs, and goal IDs to ObjectId
        const categoryIds = product_categories;
        const flavourIds = product_falvours;
        const goalIds = product_goal;

        // Validate category IDs and fetch category details
        const categories = await Category.find({ _id: { $in: categoryIds } });
        const flavours = await Flavour.find({ _id: { $in: flavourIds } });
        const goals = await Goal.find({ _id: { $in: goalIds } });

        if (categories.length !== product_categories.length) {
            return res.status(400).json({ success: false, message: 'Invalid category IDs provided' });
        }
        if (flavours.length !== product_falvours.length) {
            return res.status(400).json({ success: false, message: 'Invalid flavour IDs provided' });
        }
        if (goals.length !== product_goal.length) {
            return res.status(400).json({ success: false, message: 'Invalid goal IDs provided' });
        }

        // Create arrays of category, flavour, and goal objects containing necessary details
        const categoryDetails = categories.map(category => ({
            id: category._id,
            name: category.name,
            // Add other fields as needed (description, etc.)
        }));
        const flavourDetails = flavours.map(flavour => ({
            id: flavour._id,
            name: flavour.name,
            // Add other fields as needed (description, etc.)
        }));
        const goalDetails = goals.map(goal => ({
            id: goal._id,
            name: goal.name,
            // Add other fields as needed (description, etc.)
        }));

        // Update existing product or create new if productId is not found
        const productId = req.params.productId;
        let product;

        if (productId) {
            // Update existing product
            product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Update product fields
            product.name = name;
            product.weight = weight;
            product.weight_type = weight_type;
            product.sku = sku;
            product.sale_price = sale_price;
            product.mrp = mrp;
            product.tax_type_tag = tax_type_tag;
            product.stock_levels = stock_levels;
            product.product_description = product_description;
            product.product_overview = product_overview;
            product.product_benefits = product_benefits;
            product.product_ingredients = product_ingredients;
            product.product_details = product_details;
            product.product_categories = categoryDetails;
            product.product_falvours = flavourDetails;
            product.product_goal = goalDetails;

            // Update images if provided
            if (req.files.product_image) {
                product.product_image = req.files.product_image[0].path;
            }
            if (req.files.product_slide_image) {
                product.product_slide_image = req.files.product_slide_image[0].path;
            }
            if (req.files.product_promo_banner_image) {
                product.product_promo_banner_image = req.files.product_promo_banner_image[0].path;
            }
            if (req.files.product_video_image) {
                product.product_video_image = req.files.product_video_image[0].path;
            }
            if (req.files.product_creative_image) {
                product.product_creative_image = req.files.product_creative_image[0].path;
            }
        } else {
            // Create new product instance
            product = new Product({
                name,
                weight,
                weight_type,
                sku,
                sale_price,
                mrp,
                tax_type_tag,
                stock_levels,
                product_image: req.files.product_image ? req.files.product_image[0].path : null,
                product_slide_image: req.files.product_slide_image ? req.files.product_slide_image[0].path : null,
                product_promo_banner_image: req.files.product_promo_banner_image ? req.files.product_promo_banner_image[0].path : null,
                product_video_image: req.files.product_video_image ? req.files.product_video_image[0].path : null,
                product_creative_image: req.files.product_creative_image ? req.files.product_creative_image[0].path : null,
                product_description,
                product_overview,
                product_benefits,
                product_ingredients,
                product_details,
                product_categories: categoryDetails,
                product_falvours: flavourDetails,
                product_goal: goalDetails
            });
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Get all products
router.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a product by ID with reviews
router.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:productId', isAdmin, async (req, res, next) => {
    const { productId } = req.params;
    try {
        // Find the Goal by ID and delete it
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'product not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'product deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
