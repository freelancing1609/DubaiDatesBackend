// models/Product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductReviewSchema = require('./ProductReview').schema;
const couponSchema = require('./Coupon').schema;

const ProductSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    weight: { type: String, required: true },
    weight_type: { type: String, required: true },
    sku: { type: String, required: true },
    sale_price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    tax_type_tag: { type: String, required: true },
    stock_levels: { type: Number, required: true },
    product_image: { type: String },
    product_slide_image: { type: String },
    product_promo_banner_image: { type: String },
    product_video_image: { type: String },
    product_creative_image: { type: String },
    product_description: { type: String },
    product_overview: { type: String },
    product_benefits: { type: String },
    product_ingredients: { type: String },
    product_details: { type: String },
    product_reviews: { type: [ProductReviewSchema] ,default: []},
    product_coupons: { type: [couponSchema] ,default: []},
    product_categories: [{ type: Object }],
    product_falvours: [{ type: Object }],
    product_goal: [{ type: Object }],
});

ProductSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this._id = count + 1;
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('Product', ProductSchema);
