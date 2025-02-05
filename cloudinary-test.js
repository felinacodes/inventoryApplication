require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    http_timeout: 900000,  // Custom timeout
    secure: true,
    debug: true,  // Enable debug mode
});


const imagePath = path.resolve(__dirname, 'public/uploads/test-image-small.jpg');
const file = fs.readFileSync(imagePath);  // Read file content

cloudinary.uploader.upload('https://yourserver.com/path/to/image.jpg', {
    folder: 'uploads',
    public_id: 'unique-image-id',
    upload_preset: 'brgqgazs'
}, (error, result) => {
    if (error) {
        console.error('Error uploading to Cloudinary:', error.message);
    } else {
        console.log('Image uploaded successfully:', result);
        console.log('Image URL:', result.secure_url);
    }
});

