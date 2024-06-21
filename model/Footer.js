const mongoose = require('mongoose');
const Category = require('./Category');

const footerSchema = new mongoose.Schema({
    foot_image: { type: String},
  categories: [{ type: Object }],
  quickLinks: [{
    name: { type: String, required: [true, "Please enter quicklinks name!"], trim: true },
    
    links: { type: String, required: [true, "Please enter quicklinks links!"], trim: true }
  }],
  contactUs: {
    email: { type: String, required: [true, "Please enter your email!"], unique: true, trim: true },
    phoneNumber: { type: Number, required: [true, "Please enter your phone number!"], unique: true },
    address: { type: String, required: [true, "Please enter your address!"], unique: true, trim: true },
  },
  socialLinks: [{
    name: { type: String, required: [true, "Please enter sociallinks name!"], trim: true },
    
    links: { type: String, required: [true, "Please enter quicklinks links!"], trim: true }
  }]
});

// Pre-save hook to populate categories with all category data by default
footerSchema.pre('save', async function(next) {
    try {
        // Fetch all categories from the database
        const allCategories = await Category.find();
        // Map category IDs and assign to categories field
        this.categories = allCategories.map(category => ({
            _id: category._id,
            name: category.name
        }));
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model('Footer', footerSchema);
