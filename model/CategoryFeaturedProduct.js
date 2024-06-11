const mongoose = require('mongoose');

const categoryFeaturedProductSchema = new mongoose.Schema({
    _id: { type: Number },
    category: { 
        type: Number, 
        ref: 'Category', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    subtitle: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    mobileImage: { 
        type: String, 
        required: true 
    }
});
categoryFeaturedProductSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('CategoryFeaturedProduct', categoryFeaturedProductSchema);
