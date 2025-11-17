
const Course = require('../models/Course');
const path = require('path');

// Get all published courses
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .populate('category', 'name')
      .select('-days.content')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .populate('category', 'name');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, days, isPublished } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    let parsedDays = [];
    if (days) {
      parsedDays = typeof days === 'string' ? JSON.parse(days) : days;
      if (parsedDays.length > 5) {
        return res.status(400).json({ error: 'Course cannot have more than 5 days' });
      }

      // Get uploaded video files (from req.dayVideosFiles or req.files)
      const dayVideos = req.dayVideosFiles || req.files?.dayVideos || [];
      // Get uploaded PDF files
      const dayPdfs = req.dayPdfsFiles || [];

      // Validate and structure days with video URLs, PDFs, notes, and tasks
      parsedDays = parsedDays.map((day, index) => {
        // Match video file with day number (dayVideos[index] or find by dayNumber)
        let videoUrl = day.videoUrl || day.content?.videoUrl || '';

        // If video file was uploaded for this day, use its URL
        if (dayVideos[index] && dayVideos[index].path) {
          videoUrl = dayVideos[index].path;
        } else if (day.dayNumber) {
          // Try to find video by day number
          const videoFile = dayVideos.find((v, i) => {
            // Check if filename or fieldname indicates day number
            return v.fieldname === `dayVideos[${day.dayNumber - 1}]` ||
              v.originalname.includes(`day${day.dayNumber}`);
          });
          if (videoFile && videoFile.path) {
            videoUrl = videoFile.path;
          }
        }

        // Match PDF files for this day
        const dayPdfFiles = dayPdfs.filter(pdf => {
          // Extract day index from fieldname like "dayPdfs[0]" or "dayPdfs[1]"
          const match = pdf.fieldname?.match(/dayPdfs\[(\d+)\]/);
          if (match) {
            return parseInt(match[1]) === index;
          }
          return false;
        }).map(pdf => ({
          name: pdf.originalname,
          url: pdf.path,
          size: pdf.size
        }));

        // Get notes and tasks from day data
        const notes = day.notes || day.content?.notes || '';
        const tasks = day.tasks || day.content?.tasks || [];

        return {
          dayNumber: day.dayNumber || index + 1,
          title: day.title || `Day ${index + 1}`,
          content: {
            videoUrl: videoUrl,
            text: day.text || day.content?.text || '',
            pdfFiles: dayPdfFiles.length > 0 ? dayPdfFiles : (day.content?.pdfFiles || []),
            notes: notes,
            tasks: tasks,
            quiz: day.quiz || day.content?.quiz || null
          }
        };
      });
    }

    const courseData = {
      title,
      description,
      category,
      instructor: req.user._id,
      days: parsedDays,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true
    };

    // Handle cover image (from req.coverImageFile, req.files.coverImage, or req.file for backward compatibility)
    if (req.coverImageFile && req.coverImageFile.path) {
      courseData.coverImage = req.coverImageFile.path;
    } else if (req.files?.coverImage && req.files.coverImage[0]?.path) {
      courseData.coverImage = req.files.coverImage[0].path;
    } else if (req.file && req.file.path) {
      courseData.coverImage = req.file.path;
    }

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name')
      .populate('category', 'name');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, days, isPublished, category } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (typeof isPublished === 'boolean') course.isPublished = isPublished;

    // Handle cover image
    if (req.coverImageFile && req.coverImageFile.path) {
      course.coverImage = req.coverImageFile.path;
    } else if (req.file && req.file.path) {
      course.coverImage = req.file.path;
    }

    // Handle days update with PDFs, notes, and tasks
    if (days) {
      let parsedDays = typeof days === 'string' ? JSON.parse(days) : days;
      const dayVideos = req.dayVideosFiles || [];
      const dayPdfs = req.dayPdfsFiles || [];

      parsedDays = parsedDays.map((day, index) => {
        // Match video file
        let videoUrl = day.videoUrl || day.content?.videoUrl || '';
        if (dayVideos[index] && dayVideos[index].path) {
          videoUrl = dayVideos[index].path;
        }

        // Match PDF files
        const dayPdfFiles = dayPdfs.filter(pdf => {
          const match = pdf.fieldname?.match(/dayPdfs\[(\d+)\]/);
          if (match) {
            return parseInt(match[1]) === index;
          }
          return false;
        }).map(pdf => ({
          name: pdf.originalname,
          url: pdf.path,
          size: pdf.size
        }));

        return {
          dayNumber: day.dayNumber || index + 1,
          title: day.title || `Day ${index + 1}`,
          content: {
            videoUrl: videoUrl,
            text: day.text || day.content?.text || '',
            pdfFiles: dayPdfFiles.length > 0 ? dayPdfFiles : (day.content?.pdfFiles || []),
            notes: day.notes || day.content?.notes || '',
            tasks: day.tasks || day.content?.tasks || [],
            quiz: day.quiz || day.content?.quiz || null
          }
        };
      });

      course.days = parsedDays;
    }

    await course.save();
    const updatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name')
      .populate('category', 'name');

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
