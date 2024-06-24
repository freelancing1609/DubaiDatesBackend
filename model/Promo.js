const mongoose = require('mongoose');

const promoProductSchema = new mongoose.Schema({
  slide_image: { type: String, required: [true, "Please enter the slide image URL!"], trim: true },
  mobile_image: { type: String, required: [true, "Please enter the mobile image URL!"], trim: true },
  name: { type: String, required: [true, "Please enter the product name!"], trim: true },
  sale_price: { type: Number, required: [true, "Please enter the sale price!"], trim: true },
});

const promoSchema = new mongoose.Schema({
  _id: { type: Number },
  promo_title: { type: String, required: [true, "Please enter your promo title!"], trim: true },
  promo_description: { type: String, required: [true, "Please enter your promo description!"], trim: true },
  promo_products: [promoProductSchema],
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
