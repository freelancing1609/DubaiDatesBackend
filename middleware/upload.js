const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary'); // Adjust the path as needed
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'DubaiDates', // Specify the folder name in Cloudinary
        format: async (req, file) => {
            try {
                // Format can be controlled here, or it can be detected by Cloudinary automatically
                return path.extname(file.originalname).slice(1); // Return file extension
            } catch (error) {
                throw new Error('Error determining file format.');
            }
        },
        public_id: (req, file) => {
            try {
                // The file on Cloudinary will have the same name as the original file
                return path.basename(file.originalname, path.extname(file.originalname));
            } catch (error) {
                throw new Error('Error generating public ID.');
            }
        }
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Example: limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file format'), false);
        }
    }
});


module.exports = upload; // Make sure to export the upload middleware
