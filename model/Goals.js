const mongoose = require('mongoose');


const goalSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: [true, "Please enter goal name!"], trim: true }
});

goalSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Goal', goalSchema);
