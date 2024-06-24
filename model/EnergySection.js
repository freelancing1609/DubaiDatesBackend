const mongoose = require('mongoose');

const energySectionSchema = new mongoose.Schema({
  _id: { type: Number },
  energy_title: { type: String, required: [true, "Please enter your energy title!"], trim: true },
  energy_subTitle: { type: String, required: [true, "Please enter your energy sub title!"], trim: true },
  energy_description: { type: String, required: [true, "Please enter your energy description!"], trim: true },
  energy_mobile_description: { type: String, required: [true, "Please enter your mobile description!"], trim: true },
  energy_image: { type: String, required: [true, "Please enter your Image Url!"] },
  energy_mobileImage: { type: String, required: [true, "Please enter your Image Url!"] },
});

energySectionSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('EnergySection', energySectionSchema);
