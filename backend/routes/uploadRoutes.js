const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;  
const streamifier = require('streamifier');

const router = express.Router(); 

require('dotenv').config();

// Cloudinary configuration
cloudinary.config({  
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Function to handle the upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {  
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
                // Chỉ giữ dòng này ở trong Promise
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        }
        
        // Call the streamUpload function with the file buffer
        const result = await streamUpload(req.file.buffer);
        
        // Respond with the uploaded image URL
        res.json({ imageUrl: result.secure_url });
        
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;