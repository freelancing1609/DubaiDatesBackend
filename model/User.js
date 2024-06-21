const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;



const UserSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: [true, "Please enter your name!"], trim: true },
    email: { type: String, required: [true, "Please enter your email!"], unique: true, trim: true },
    phoneNumber: { type: Number, required: [true, "Please enter your phone number!"], unique: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    created_date: { type: Date, default: Date.now },
});

// Define a pre-save hook to set the _id field before saving the document
UserSchema.pre('save', async function(next) {
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



UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

module.exports = mongoose.model('User', UserSchema);
