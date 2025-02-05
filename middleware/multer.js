const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 120000 // Set timeout to 60 seconds (60000 milliseconds)
});

// Set storage engine to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
        return {
            folder: 'uploads',
            format: file.mimetype.split('/')[1],
            public_id: file.fieldname + '-' + uniqueSuffix
        };
    }
});


// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('photo');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
}

// Middleware to handle multer errors
function uploadMiddleware(req, res, next) {
    console.log(`from multer edited`);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);
            req.fileValidationError = new Error('Error: File size too large. Maximum size is 5MB.');
        } else if (err) {
            console.error("Multer unexpected error:", err);
            req.fileValidationError = new Error(err);
        }
        console.log("File uploaded successfully:", req.file);
        next();
    });
    
}

module.exports = uploadMiddleware;