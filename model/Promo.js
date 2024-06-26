const mongoose = require('mongoose');


const promoSchema = new mongoose.Schema({
  _id: { type: Number },
  promo_title: { type: String, required: [true, "Please enter your promo title!"], trim: true },
  promo_subTitle: { type: String, required: [true, "Please enter your promo sub title!"], trim: true },
  promo_image: { type: String, required: [true, "Please enter your Image Url!"] },
  promo_mobileImage: { type: String, required: [true, "Please enter your Image Url!"] },
});

promoSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Promo', promoSchema);