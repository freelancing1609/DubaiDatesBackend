const express = require('express');
const router = express.Router();
const Footer = require('../model/Footer');
const { isAdmin } = require('../middleware/admin');
const Category = require('../model/Category');
const upload = require('../middleware/upload');

// Create or update footer (singleton pattern)
// Create Endpoint for Creating or Updating Footer Data
router.post('/footer-add', isAdmin,upload.single('image'), async (req, res) => {
    try {
        let footer = await Footer.findOne();
        if (!footer) {
            footer = new Footer();
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        // Get the image URL from Cloudinary
        const imageUrl =  req.file.path;
        console.log(imageUrl)
        // Update footer fields
        footer.foot_image = imageUrl;
        footer.contactUs = req.body.contactUs
        // Generate IDs for quicklinks if not already present
        if (req.body.quickLinks && req.body.quickLinks.length > 0) {
            req.body.quickLinks.forEach((link, index) => {
                if (!link._id) {
                    link._id = index + 1; // Start from 1
                }
            });
        }
        footer.quickLinks = req.body.quickLinks;
        
        // Generate IDs for socialLinks if not already present
        if (req.body.socialLinks && req.body.socialLinks.length > 0) {
            req.body.socialLinks.forEach((link, index) => {
                if (!link._id) {
                    link._id = index + 1; // Start from 1
                }
            });
        }
        footer.socialLinks = req.body.socialLinks;

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
