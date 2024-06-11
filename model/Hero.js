const mongoose = require('mongoose');


const heroSchema = new mongoose.Schema({
  _id: { type: Number },
  hero_name: { type: String, required: [true, "Please enter your image name!"], trim: true },
  hero_image: { type: String, required: [true, "Please enter your Image Url!"] },
});

heroSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Hero', heroSchema);
