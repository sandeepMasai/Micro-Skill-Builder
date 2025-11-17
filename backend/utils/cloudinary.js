
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

// 👤 For User Avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }
    ],
  },
});

// 📄 For PDF Files
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course_pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

module.exports = { cloudinary, imageStorage, videoStorage, avatarStorage, pdfStorage };
