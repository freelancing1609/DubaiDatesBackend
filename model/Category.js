const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: [true, "Please enter your name!"], trim: true },
    cat_image: { type: String, required: [true, "Please enter your Image Url!"] },
    cat_description: { type: String, required: [true, "Please enter your Category Description!"]},
    order_by: { type: Number, unique:true },
});

// Define a pre-save hook to set the _id field before saving the document
CategorySchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this._id = count + 1;
        this.order_by=count + 1;
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model('Category', CategorySchema);
