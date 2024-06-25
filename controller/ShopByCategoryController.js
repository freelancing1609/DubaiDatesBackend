const express = require('express');
const router = express.Router();
const ShopByCategory = require('../model/ShopByCategory')
const {isAuthenticated } = require('../middleware/isAuthenticated')
const {createShopByCategory,deleteShopByCategory}=require('../utils/Privilege')
// Define the route to create or update the ShopByCategory document
router.post('/shop-by-category', isAuthenticated(['admin'],[createShopByCategory]), async (req, res, next) => {
    const { shop_by_categories_title, shop_by_categories_button_link_url, shop_by_categories_link_name } = req.body;
    try {
        // Check if ShopByCategory document already exists
        let shopByCategory = await ShopByCategory.findOne();

        if (shopByCategory) {
            // Update the existing document
            shopByCategory.shop_by_categories_title = shop_by_categories_title;
            shopByCategory.shop_by_categories_button_link_url = shop_by_categories_button_link_url;
            shopByCategory.shop_by_categories_link_name = shop_by_categories_link_name;


            shopByCategory = await shopByCategory.save();
            return res.status(200).json({ success: true, shopByCategory });
        } else {
                const newShopByCategory = new ShopByCategory({
                shop_by_categories_title,
                shop_by_categories_button_link_url,
                shop_by_categories_link_name            });

            const shopByCategory = await newShopByCategory.save();
            return res.status(201).json({ success: true, shopByCategory });
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to get the ShopByCategory document
router.get('/shop-by-category', async (req, res, next) => {
    try {
        // Fetch the ShopByCategory document from the database
        const shopByCategory = await ShopByCategory.findOne();
        if (!shopByCategory) {
            return res.status(404).json({ success: false, message: 'No ShopByCategory found' });
        }
        res.status(200).json({ success: true, shopByCategory });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to delete the ShopByCategory document
router.delete('/shop-by-category', isAuthenticated(['admin'],[deleteShopByCategory]), async (req, res, next) => {
    try {
        // Find and delete the ShopByCategory document
        const shopByCategory = await ShopByCategory.findOneAndDelete();
        if (!shopByCategory) {
            return res.status(404).json({ success: false, message: 'No ShopByCategory found' });
        }
        res.status(200).json({ success: true, message: 'ShopByCategory deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
