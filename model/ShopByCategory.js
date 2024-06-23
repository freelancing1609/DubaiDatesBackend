const mongoose = require('mongoose');

const ShopByCategorySchema = new mongoose.Schema({
    _id: { type: Number },
    shop_by_categories_title: { type: String, required: [true, "Please enter the title!"], trim: true },
    shop_by_categories_button_link_url: { type: String, required: [true, "Please enter the button link URL!"] },
    shop_by_categories_link_name: { type: String, required: [true, "Please enter the link name!"] },
    categories: [{ 
        _id: { type: Number },
        name: { type: String },
        cat_image: { type: String },
        cat_description: { type: String },
        order_by: { type: Number }
    }]
});

// Define a pre-save hook to set the _id field before saving the document
ShopByCategorySchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this._id = count + 1;
        this.order_by = count + 1;

        const Category = mongoose.model('Category');
        const categories = await Category.find({});
        this.categories = categories;

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('ShopByCategory', ShopByCategorySchema);
