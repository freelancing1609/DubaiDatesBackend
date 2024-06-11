const mongoose = require('mongoose');


const flavourSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: [true, "Please enter your falovour name!"], trim: true }
});

flavourSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Flavour', flavourSchema);
