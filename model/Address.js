const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    user_id:{type: Number, required: true, ref: 'User'},
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


  module.exports = mongoose.model('Address', AddressSchema);