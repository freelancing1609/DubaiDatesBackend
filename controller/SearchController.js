// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// Search products route
router.get('/products', async (req, res) => {
    try {
        const searchTerm = req.query.search; // Fetch the search term from query parameter 'q'
        
        // Perform search query using regex for flexibility
        const products = await Product.find({ name: { $regex: `^${searchTerm}`, $options: 'i' } })
                                      .limit(10) // Limit to 10 results for example
                                      .exec();

        res.status(200).json({ success: true, products: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
