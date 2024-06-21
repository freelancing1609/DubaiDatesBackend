const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Coupon = require('../model/Coupon');
const Product = require('../model/Product');
const {isAuthenticated} = require("../middleware/auth");
const { isAdmin } = require('../middleware/admin');

// Create a new coupon
router.post('/create',isAdmin, async (req, res) => {
    try {
        const couponData = req.body;
        const coupon = new Coupon(couponData);
        await coupon.save();

        // If the coupon is product-specific, save the entire coupon data to the product's product_coupons array
        if (coupon.discount_scope === 'PRODUCT' && coupon.product_id) {
            const product = await Product.findOne({ _id: coupon.product_id });
            if (product) {
                product.product_coupons.push(couponData);
                await product.save();
            }
        }

        res.status(201).json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all coupons
router.get('/list',isAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Apply a coupon
router.post('/apply',isAuthenticated, async (req, res) => {
    try {
        const { coupon_name, product_id, total_price } = req.body;

        // Find the coupon by name
        const coupon = await Coupon.findOne({ coupon_name });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // Check if the coupon is valid
        const currentDate = new Date();
        if (currentDate < coupon.from_date || currentDate > coupon.valid_date) {
            return res.status(400).json({ error: 'Coupon is not valid' });
        }

        let discountAmount = 0;

        // Apply product-specific discount
        if (coupon.discount_scope === 'PRODUCT' && coupon.product_id === product_id) {
            // Find the product
            const product = await Product.findById(product_id);
           
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Calculate discount based on discount type
            if (coupon.discount_type === 'PERCENTAGE') {
                discountAmount = (product.mrp * coupon.discount_amount) / 100;
            } else if (coupon.discount_type === 'FLAT') {
                discountAmount = coupon.discount_amount;
            }

            // Calculate discounted price
            const discountedPrice = product.mrp - discountAmount;

            
            return res.status(200).json({ product_id: product._id, original_price: product.mrp, discounted_price: discountedPrice });
        }
        if (coupon.discount_scope === 'GENERAL') {
            // Check if total price meets minimum amount requirement, if specified
            if (coupon.min_amount && total_price < coupon.min_amount) {
                return res.status(400).json({ error: 'Total price does not meet minimum amount requirement for this coupon' });
            }

            // Apply discount based on discount type
            if (coupon.discount_type === 'PERCENTAGE') {
                discountAmount = (total_price * coupon.discount_amount) / 100;
            } else if (coupon.discount_type === 'FLAT') {
                discountAmount = coupon.discount_amount;
            }

            // Calculate discounted total price
            const discountedTotalPrice = total_price - discountAmount;

            // Prepare response for general discount coupon
            return res.status(200).json({ original_total_price: total_price, discounted_total_price: discountedTotalPrice });
        }

        res.status(400).json({ error: 'Invalid discount scope or missing product ID' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:id', isAdmin, async (req, res, next) => {
    const { id } = req.params;
    try {
        // Find the Goal by ID and delete it
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
