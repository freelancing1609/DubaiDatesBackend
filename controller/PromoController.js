const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Import the upload middleware
const Promo = require('../model/Promo'); // Import your Promo model
const { isAuthenticated } = require('../middleware/isAuthenticated');
const {createPromoProduct,updatePromoProduct,deletePromoProduct} = require('../utils/Privilege')
// Define the route to create a promo
router.post('/create', isAuthenticated(['admin'],[createPromoProduct]), upload.fields([ { name: 'promo_products[].slide_image', maxCount: 1 }, { name: 'promo_products[].mobile_image', maxCount: 1 }]), async (req, res, next) => {
    const { promo_title, promo_description, promo_products } = req.body;
    try {
  

        // Parse the promo products JSON if it's a string
        let promoProducts = [];
        if (typeof promo_products === 'string') {
            promoProducts = JSON.parse(promo_products);
        } else {
            promoProducts = promo_products;
        }

        // Update the promo products with image paths
        promoProducts = promoProducts.map((product, index) => {
            if (req.files[`promo_products[${index}].slide_image`]) {
                product.slide_image = req.files[`promo_products[${index}].slide_image`][0].path;
            }
            if (req.files[`promo_products[${index}].mobile_image`]) {
                product.mobile_image = req.files[`promo_products[${index}].mobile_image`][0].path;
            }
            return product;
        });

        // Create a new promo object
        const newPromo = new Promo({
            promo_title,
            promo_description,
            promo_image: promoImageUrl, // Save the promo image URL to the database
            promo_products: promoProducts,
        });

        // Save the promo to the database
        const promo = await newPromo.save();

        // Send response
        res.status(201).json({ success: true, promo });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to get all promos
router.get('/get', async (req, res, next) => {
    try {
        // Fetch all promos from the database
        const promos = await Promo.find();
        // Send response
        res.status(200).json({ success: true, promos });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to update a promo
router.put('/update/:id', isAuthenticated(['admin'],[updatePromoProduct]), upload.fields([ { name: 'promo_products[].slide_image', maxCount: 1 }, { name: 'promo_products[].mobile_image', maxCount: 1 }]), async (req, res, next) => {
    const { id } = req.params;
    const { promo_title, promo_description, promo_products } = req.body;
    try {
        // Find the promo by ID
        const promo = await Promo.findById(id);
        if (!promo) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }

        // Update promo fields
        if (promo_title) promo.promo_title = promo_title;
        if (promo_description) promo.promo_description = promo_description;
        

        // Update promo products if provided
        if (promo_products) {
            let promoProducts = typeof promo_products === 'string' ? JSON.parse(promo_products) : promo_products;

            // Update the promo products with image paths
            promoProducts = promoProducts.map((product, index) => {
                if (req.files[`promo_products[${index}].slide_image`]) {
                    product.slide_image = req.files[`promo_products[${index}].slide_image`][0].path;
                }
                if (req.files[`promo_products[${index}].mobile_image`]) {
                    product.mobile_image = req.files[`promo_products[${index}].mobile_image`][0].path;
                }
                return product;
            });

            promo.promo_products = promoProducts;
        }

        // Save the updated promo to the database
        const updatedPromo = await promo.save();

        // Send response
        res.status(200).json({ success: true, updatedPromo });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to delete a promo
router.delete('/delete/:id', isAuthenticated(['admin'],[deletePromoProduct]), async (req, res, next) => {
    const { id } = req.params;
    try {
        // Find the promo by ID and delete it
        const promo = await Promo.findByIdAndDelete(id);

        if (!promo) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'Promo deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
