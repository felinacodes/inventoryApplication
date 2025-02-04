const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;


// Set storage engine
// const storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function(req, file, cb) {
//         console.log('Processing file:', file.originalname); // Debugging line
//         const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
//         const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
//         // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(sanitizedFilename));
//     }
// });
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', 
        public_id: (req, file) => {
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
            return file.fieldname + '-' + uniqueSuffix + path.extname(sanitizedFilename);
        }
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024000 }, // 1MB limit
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
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                req.fileValidationError = new Error('Error: File size too large. Maximum size is 1MB.');
            } else {
                req.fileValidationError = err;
            }
        } else if (err) {
            req.fileValidationError = new Error(err);
        }
        next();
    });
}

module.exports = uploadMiddleware;