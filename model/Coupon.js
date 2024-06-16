const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    
  coupon_name: { type: String, required: true },
  discount_type: { type: String, required: true, enum: ['PERCENTAGE', 'FLAT'] },
  discount_amount: { type: Number, required: true },
  discount_scope: { type: String, required: true, enum: ['GENERAL', 'PRODUCT'] },
  product_id: { type: Number, required: false },  // Optional field for product-specific discounts
  from_date: { type: Date, required: true },
  valid_date: { type: Date, required: true },
  min_amount: { type: Number, required: false }  // Optional field
});



const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
