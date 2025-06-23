const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|hd/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and videos are allowed!'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 50 },
    fileFilter,
});

router.post(
    '/single',
    auth, 
    upload.single('file'),
    (req, res) => {
        if (req.file) {
            res.json({
                message: 'File uploaded successfully',
                filePath: `/uploads/${req.file.filename}`,
            });
        } else {
            res.status(400).json({ message: 'No file uploaded or file type not allowed.' });
        }
    },
    (error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
