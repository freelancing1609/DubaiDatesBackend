const express = require('express');
const router = express.Router();
const User = require('../model/User');
const {isAuthenticated} = require("../middleware/auth");



// Add Address
router.post('/:userId/addresses/create', isAuthenticated, async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newAddress = req.body;
      if (!newAddress.time_of_delivery) {
        newAddress.time_of_delivery = 'home'; // Ensure default value if not provided
      }
      user.addresses.push(newAddress);
      await user.save();
      res.status(201).json(user.addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update Address
  router.put('/:userId/addresses/:addressId', isAuthenticated, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the address by _id instead of addressId
        const address = user.addresses.find(a => a._id.toString() === req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        
        Object.assign(address, req.body);
        await user.save();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
router.delete('/:userId/addresses/:addressId', isAuthenticated, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the index of the address to delete by _id
        const addressIndex = user.addresses.findIndex(a => a._id.toString() === req.params.addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }
        
        // Remove the address from the addresses array
        user.addresses.splice(addressIndex, 1);
        
        await user.save();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
  // Get Addresses
  router.get('/:userId/addresses-get',isAuthenticated, async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user.addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;