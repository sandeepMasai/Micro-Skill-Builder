import { useState, useEffect, useRef } from 'react';
import { createCourse } from '../services/courseService';
import { useNavigate } from 'react-router-dom';
import API from '../Api/axios';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Tag,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  ArrowLeft,
  Plus,
  Video,
  Trash2,
  Calendar
} from 'lucide-react';

function CreateCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await API.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle cover image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setCoverImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Day management functions
  const addDay = () => {
    if (days.length >= 5) {
      setError('Maximum 5 days allowed per course');
      return;
    }
    setDays([...days, {
      dayNumber: days.length + 1,
      title: `Day ${days.length + 1}`,
      video: null,
      videoPreview: null,
      text: ''
    }]);
  };

  const removeDay = (index) => {
    const newDays = days.filter((_, i) => i !== index);
    // Renumber days
    const renumberedDays = newDays.map((day, i) => ({
      ...day,
      dayNumber: i + 1
    }));
    setDays(renumberedDays);
  };

  const updateDay = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const handleDayVideoChange = (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError(`Day ${index + 1}: Please select a valid video file`);
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setError(`Day ${index + 1}: Video size must be less than 500MB`);
      return;
    }

    const newDays = [...days];
    newDays[index].video = file;
    newDays[index].videoPreview = URL.createObjectURL(file);
    setDays(newDays);
    setError(null);
  };

  const removeDayVideo = (index) => {
    const newDays = [...days];
    if (newDays[index].videoPreview) {
      URL.revokeObjectURL(newDays[index].videoPreview);
    }
    newDays[index].video = null;
    newDays[index].videoPreview = null;
    setDays(newDays);
  };

  // Submit course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError('Course title is required');
      return;
    }

    if (title.trim().length < 3) {
      setError('Course title must be at least 3 characters long');
      return;
    }

    if (!description.trim()) {
      setError('Course description is required');
      return;
    }

    if (description.trim().length < 10) {
      setError('Course description must be at least 10 characters long');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('isPublished', isPublished);
    formData.append('category', category);

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Add days data
    if (days.length > 0) {
      const daysData = days.map(day => ({
        dayNumber: day.dayNumber,
        title: day.title.trim() || `Day ${day.dayNumber}`,
        text: day.text.trim() || '',
        videoUrl: '' // Will be set from uploaded files
      }));
      formData.append('days', JSON.stringify(daysData));

      // Add video files
      days.forEach((day, index) => {
        if (day.video) {
          formData.append('dayVideos', day.video);
        }
      });
    }

    setLoading(true);
    try {
      await createCourse(formData);
      setSuccess(true);
      setError(null);

      // Clean up video preview URLs
      days.forEach(day => {
        if (day.videoPreview) {
          URL.revokeObjectURL(day.videoPreview);
        }
      });

      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (err) {
      console.error('Course creation error:', err);
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to create course. Please try again.';
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Course
            </h1>
          </div>
          <p className="text-gray-600">Share your knowledge and help others learn</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-800">Course created successfully!</p>
              <p className="text-sm text-green-700">Redirecting to courses page...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                placeholder="Enter a compelling course title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                placeholder="Describe what students will learn in this course..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                Category <span className="text-red-500">*</span>
              </label>
              {loadingCategories ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setError(null);
                  }}
                  disabled={loading || loadingCategories}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none bg-white"
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Cover Image
              </label>
              {coverImagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                {isPublished ? (
                  <Eye className="w-5 h-5 text-green-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <label className="font-semibold text-gray-700 cursor-pointer">
                    Publish Course
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isPublished
                      ? 'Course will be visible to all students'
                      : 'Course will be saved as draft'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                disabled={loading}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${isPublished ? 'bg-blue-600' : 'bg-gray-300'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${isPublished ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Course Days Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Course Days
                </h2>
                <p className="text-sm text-gray-500 mt-1">Add up to 5 days of content (optional)</p>
              </div>
              {days.length < 5 && (
                <button
                  type="button"
                  onClick={addDay}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              )}
            </div>

            {days.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No days added yet</p>
                <p className="text-sm text-gray-500">Click "Add Day" to start adding course content</p>
              </div>
            ) : (
              <div className="space-y-6">
                {days.map((day, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {day.dayNumber}
                        </span>
                        Day {day.dayNumber}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeDay(index)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Day Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(index, 'title', e.target.value)}
                          disabled={loading}
                          placeholder={`Day ${day.dayNumber} Title`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      {/* Day Video */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-600" />
                          Video Content
                        </label>
                        {day.videoPreview ? (
                          <div className="relative">
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
                              <video
                                src={day.videoPreview}
                                controls
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDayVideo(index)}
                              disabled={loading}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                              {day.video?.name} ({(day.video?.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          </div>
                        ) : (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                              <input
                                type="file"
                                accept="video/mp4,video/mov,video/avi,video/quicktime"
                                onChange={(e) => handleDayVideoChange(index, e.target.files?.[0])}
                                disabled={loading}
                                className="hidden"
                              />
                              <div className="flex flex-col items-center gap-2">
                                <Video className="w-8 h-8 text-gray-400" />
                                <p className="text-sm font-medium text-gray-700">
                                  Click to upload video
                                </p>
                                <p className="text-xs text-gray-500">
                                  MP4, MOV, AVI up to 500MB
                                </p>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>

                      {/* Day Text Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Content (Optional)
                        </label>
                        <textarea
                          value={day.text}
                          onChange={(e) => updateDay(index, 'text', e.target.value)}
                          disabled={loading}
                          placeholder="Add additional text content for this day..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || loadingCategories}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Course
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCoursePage;
