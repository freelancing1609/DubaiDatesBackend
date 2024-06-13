const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


const AddressSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    phoneNumber: { type: Number},
    alt_phoneNumber: { type: Number},
    landmark: { type: String },
    city: { type: String},
    state: { type: String},
    zipCode: { type: String},
    time_of_delivery: { type: String, default: "Home" },
    locality: { type: String},
    full_address:{type:String}
  });

const UserSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: [true, "Please enter your name!"], trim: true },
    email: { type: String, required: [true, "Please enter your email!"], unique: true, trim: true },
    phoneNumber: { type: Number, required: [true, "Please enter your phone number!"], unique: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    addresses: { type: [AddressSchema], default: [] }
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
