const express = require("express");
const router = express.Router();
const Product = require("../model/Product");
const ProductReview = require("../model/ProductReview");
const User = require("../model/User");
const { isAuthenticated } = require("../middleware/auth");
const mongoose = require("mongoose");

router.post("/reviews/:productId", isAuthenticated, async (req, res) => {
  try {
    const { user_id, rating, comment } = req.body;
    const productId = req.params.productId;

    // Fetch user details by user_id
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product by productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Create a new product review instance
    const productReview = new ProductReview({
      user_id: user._id,
      product_id: productId,
      rating,
      comment,
      created_date: new Date(),
      updated_at: new Date(),
      user_name: user.name,
    });

    // Save the product review
    await productReview.save();
    // Push the product review into product_reviews array of the product
    product.product_reviews.push(productReview);

    // Save the product with the updated product_reviews array
    await product.save();

    res.status(201).json(productReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reviews by user ID
router.get('/reviews/:userId',isAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const userIdtoNumb = Number(userId);
    try {
        console.log(typeof userId);
        
        // Find reviews by user ID
        const reviews = await ProductReview.find({user_id:userIdtoNumb});

        // If no reviews found, return empty array
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'No reviews found for this user' });
        }

        // Prepare an array to hold the product details of each review
        const productIds = reviews.map(review => review.product_id);
        const products = await Product.find({ _id: { $in: productIds } });

        // Create a map of product details for quick lookup
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = {
                _id: product._id,
                name: product.name,
                weight: product.weight,
                sku: product.sku,
                sale_price: product.sale_price,
                mrp: product.mrp,
                tax_type_tag: product.tax_type_tag,
                stock_levels: product.stock_levels,
                product_image: product.product_image
            };
        });

        // Attach product details to each review
        const reviewsWithProducts = reviews.map(review => ({
            _id: review._id,
            user_id: review.user_id,
            product_id: review.product_id,
            rating: review.rating,
            comment: review.comment,
            created_date: review.created_date,
            product: productMap[review.product_id.toString()]
        }));

        res.status(200).json({ success: true, reviews: reviewsWithProducts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
