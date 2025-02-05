const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

// Get the full file path
const filePath = path.resolve(__dirname, '/public/uploads/test-image.jpg');

// Upload to Cloudinary
cloudinary.uploader.upload(filePath)
  .then(result => console.log("✅ Upload Successful!", result))
  .catch(error => console.error("❌ Cloudinary Upload Error:", error));
