const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllCourses,
  getInstructorCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const router = express.Router();

// Helper function to upload PDF to Cloudinary
const uploadPDFToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'course_pdfs',
        resource_type: 'raw',
        format: 'pdf',
        public_id: filename.replace(/\.pdf$/i, '')
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Middleware to handle course file uploads (cover image + day videos)
const uploadCourseFiles = (req, res, next) => {
  // Use memory storage to get all files first
  const upload = multer({ storage: multer.memoryStorage() }).any();

  upload(req, res, async (err) => {
    if (err) return next(err);

    req.coverImageFile = null;
    req.dayVideosFiles = [];

    try {
      // Process cover image if present
      const coverImage = req.files?.find(f => f.fieldname === 'coverImage');
      if (coverImage) {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'course_images',
              resource_type: 'image',
              allowed_formats: ['jpg', 'png', 'jpeg']
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          // Write buffer to stream
          uploadStream.end(coverImage.buffer);
        });

        req.coverImageFile = {
          fieldname: 'coverImage',
          originalname: coverImage.originalname,
          path: result.secure_url,
          filename: result.public_id
        };
      }

      // Process day videos if present
      const videos = req.files?.filter(f => f.fieldname === 'dayVideos') || [];
      if (videos.length > 0) {
        // Upload all videos in parallel
        const videoResults = await Promise.all(
          videos.map((video) => {
            return new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'course_videos',
                  resource_type: 'video',
                  allowed_formats: ['mp4', 'mov', 'avi'],
                  chunk_size: 6000000 // 6MB chunks for large videos
                },
                (error, result) => {
                  if (error) return reject(error);
                  resolve({
                    fieldname: 'dayVideos',
                    originalname: video.originalname,
                    path: result.secure_url,
                    filename: result.public_id
                  });
                }
              );

              // Write buffer to stream
              uploadStream.end(video.buffer);
            });
          })
        );

        req.dayVideosFiles = videoResults;
      }

      // Process PDF files if present
      const pdfFiles = req.files?.filter(f => f.fieldname && f.fieldname.startsWith('dayPdfs')) || [];
      if (pdfFiles.length > 0) {
        // Group PDFs by day index (dayPdfs[0], dayPdfs[1], etc.)
        const pdfResults = await Promise.all(
          pdfFiles.map((pdf) => {
            return uploadPDFToCloudinary(pdf.buffer, pdf.originalname)
              .then(result => ({
                fieldname: pdf.fieldname,
                originalname: pdf.originalname,
                path: result.secure_url,
                filename: result.public_id,
                size: pdf.size
              }));
          })
        );

        req.dayPdfsFiles = pdfResults;
      }

      next();
    } catch (error) {
      console.error('File upload error:', error);
      next(error);
    }
  });
};

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/instructor/my-courses', auth, authorize('instructor', 'admin'), getInstructorCourses);
router.post('/', auth, authorize('instructor', 'admin'), uploadCourseFiles, createCourse);
router.put('/:id', auth, authorize('instructor', 'admin'), uploadCourseFiles, updateCourse);
router.delete('/:id', auth, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
