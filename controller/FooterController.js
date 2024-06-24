const express = require('express');
const router = express.Router();
const Footer = require('../model/Footer');
const Category = require('../model/Category');
const upload = require('../middleware/upload');
const {isAuthenticated}=require('../middleware/isAuthenticated');
const { createFooter} = require('../utils/Privilege');
// Create or update footer (singleton pattern)
// Create Endpoint for Creating or Updating Footer Data
router.post('/footer-add', isAuthenticated(["admin"],[createFooter]), upload.single('image'), async (req, res) => {
  try {
      let contactUs = req.body.contactUs;
      let quickLinks = req.body.quickLinks;
      let socialLinks = req.body.socialLinks;

      // Check if the data is valid
      if (typeof contactUs !== 'object' || !Array.isArray(quickLinks) || !Array.isArray(socialLinks) ) {
          return res.status(400).json({ success: false, message: 'Invalid JSON data' });
      }

      // Find the existing footer document
      let footer = await Footer.findOne();
      if (!footer) {
          return res.status(404).json({ success: false, message: 'Footer not found' });
      }
      quickLinks = quickLinks.map(link => ({
        name: link.name || 'Unnamed Link',
        links: link.links || '#' // Provide a default URL or handle as necessary
    }));  
    socialLinks = socialLinks.map(link => ({
      name: link.name || 'Unnamed Link',
      links: link.links || '#' // Provide a default URL or handle as necessary
  }));

      // Update fields
      if (req.file) {
          const imageUrl = req.file.path; // Assuming the path is provided by your middleware
          footer.foot_image = imageUrl;
      } else if (req.body.foot_image) {
          footer.foot_image = req.body.foot_image;
      }
      footer.contactUs = contactUs;
      footer.quickLinks = quickLinks;
      footer.socialLinks = socialLinks;
      // Save the updated footer
      const updatedFooter = await footer.save();
      res.status(200).json(updatedFooter);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




// Get footer with categories data
router.get('/footerget', async (req, res) => {
  try {
    const footer = await Footer.findOne().populate('categories');
    res.status(200).json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
