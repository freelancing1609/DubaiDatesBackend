const express = require('express');
const router = express.Router();
const Address = require('../model/Address');
const User = require('../model/User');
const {isAuthenticated} = require("../middleware/isAuthenticated");
const {createCustomerAddress,updateCustomerAddress,deleteCustomerAddress,fetchCustomerAddress}=require('../utils/Privilege')


// Add Address
router.post('/:userId/addresses/create', isAuthenticated(["customer"],[createCustomerAddress]), async (req, res, next) => {
    try {
      const { userId } = req.params;
        const { street, city, state, zipCode, locality,full_address, time_of_delivery,landmark,alt_phoneNumber,phoneNumber,name } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newAddress = new Address({
        user_id: userId,
        name,
        phoneNumber,
        alt_phoneNumber,
        landmark,
        street,
        city,
        state,
        zipCode,
        locality,
        full_address,
        time_of_delivery: time_of_delivery || 'home', // Default if not provided
    });

    await newAddress.save();
    // Add address reference to user
    if (!user.addresses) {
      user.addresses = []; // Initialize addresses array if not exists
  }
  user.addresses.push(newAddress._id);
  await user.save();
    res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/:userId/addresses/:addressId', isAuthenticated(["customer"],[updateCustomerAddress]), async (req, res, next) => {
    try {
        const { userId, addressId } = req.params;
        const {
            street,
            city,
            state,
            zipCode,
            locality,
            full_address,
            time_of_delivery,
            landmark,
            alt_phoneNumber,
            phoneNumber,
            name
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update address fields
        address.street = street || address.street;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.locality = locality || address.locality;
        address.full_address = full_address || address.full_address;
        address.time_of_delivery = time_of_delivery || address.time_of_delivery;
        address.landmark = landmark || address.landmark;
        address.alt_phoneNumber = alt_phoneNumber || address.alt_phoneNumber;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.name = name || address.name;

        await address.save();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
router.delete('/:userId/addresses/:addressId', isAuthenticated(["customer"],[deleteCustomerAddress]), async (req, res, next) => {
  try {
      const { userId, addressId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove the address reference from the user
      const addressIndex = user.addresses.indexOf(addressId);
      if (addressIndex === -1) {
          return res.status(404).json({ message: 'Address not found in user record' });
      }
      
      user.addresses.splice(addressIndex, 1);
      await user.save();
      
      // Remove the actual address document
      await Address.findByIdAndRemove(addressId);
      
      res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

  
  // Get Addresses
  router.get('/:userId/addresses', isAuthenticated(["customer"],[fetchCustomerAddress]), async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all addresses by the list of address IDs
        const addresses = await Address.find({ _id: { $in: user.addresses } });

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
  module.exports = router;