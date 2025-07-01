
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { imageStorage, videoStorage } = require('../utils/cloudinary');

// ⬆️ Image Upload
const uploadImage = multer({ storage: imageStorage });
router.post('/image', auth, uploadImage.single('image'), (req, res) => {
  res.json({ url: req.file.path, publicId: req.file.filename });
});

// ⬆️ Video Upload
const uploadVideo = multer({ storage: videoStorage });
router.post('/video', auth, uploadVideo.single('video'), (req, res) => {
  res.json({ url: req.file.path, publicId: req.file.filename });
});

module.exports = router;
