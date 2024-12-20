// models/ProductReview.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductReviewSchema = new mongoose.Schema({
    user_id: { type: Object },//one user review one product for one time only 
    product_id: { type: Object },
    rating: { type: Number },
    comment: { type: String},
    created_date: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    user_name: { type: String } // Add user details
   
    
});



module.exports = mongoose.model('ProductReview', ProductReviewSchema);
