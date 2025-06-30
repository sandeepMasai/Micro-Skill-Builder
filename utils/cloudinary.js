
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📸 For Cover Images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'image',
  },
});

// 📹 For Course Videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course_videos',
    allowed_formats: ['mp4', 'mov', 'avi'],
    resource_type: 'video',
  },
});

module.exports = { cloudinary, imageStorage, videoStorage };
