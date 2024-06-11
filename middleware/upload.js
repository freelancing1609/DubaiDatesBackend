const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary'); // Adjust the path as needed
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'DubaiDates', // Specify the folder name in Cloudinary
        format: async (req, file) => {
            // Format can be controlled here, or it can be detected by Cloudinary automatically
            return path.extname(file.originalname).slice(1); // Return file extension
        },
        public_id: (req, file) => {
            // The file on Cloudinary will have the same name as the original file
            return path.basename(file.originalname, path.extname(file.originalname));
        }
    }
});

const upload = multer({ storage: storage });

module.exports = upload; // Make sure to export the upload middleware
