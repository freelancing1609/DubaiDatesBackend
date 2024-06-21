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
        let contactUs, quickLinks, socialLinks;

        try {
            contactUs = req.body.contactUs ? JSON.parse(req.body.contactUs) : {};
            quickLinks = req.body.quickLinks ? JSON.parse(req.body.quickLinks) : [];
            socialLinks = req.body.socialLinks ? JSON.parse(req.body.socialLinks) : [];
          } catch (parseError) {
            return res.status(400).json({ success: false, message: 'Invalid JSON data' });
          }
        let footer = await Footer.findOne();
        if (!footer) {
            footer = new Footer();
        }

        if (req.file) {
            const imageUrl = req.file.path; // Assuming the path is provided by your middleware
            footer.foot_image = imageUrl;
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
