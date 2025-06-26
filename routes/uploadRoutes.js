const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { uploadSingleFile } = require('../controllers/uploadController');
const { storage } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage });

router.post('/single', auth, upload.single('coverImage'), uploadSingleFile);


module.exports = router;
