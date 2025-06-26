exports.uploadSingleFile = (req, res) => {
  try {
    if (req.file && req.file.path) {
      return res.json({
        message: 'File uploaded successfully to Cloudinary',
        fileUrl: req.file.path,
        publicId: req.file.filename,
      });
    } else {
      return res.status(400).json({ message: 'File upload failed. No file received.' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload.' });
  }
};
