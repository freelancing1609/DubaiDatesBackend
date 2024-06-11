const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    _id: { type: Number },
    email: { type: String, required: [true, "Please enter your email!"], unique: true, trim: true },
    password: { type: String, required: [true, "Please enter your password!"], trim: true }
});

// Define a pre-save hook to set the _id field before saving the document
AdminSchema.pre('save', async function(next) {
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

AdminSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.ADMIN_JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

module.exports = mongoose.model('Admin', AdminSchema);
