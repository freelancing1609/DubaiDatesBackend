const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true }
});

PartnerSchema.pre('save', async function(next) {
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

const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = Partner;
