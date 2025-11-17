import React, { useState, useRef } from 'react';
import API from '../Api/axios';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  FileVideo,
  Trash2
} from 'lucide-react';

const UploadVideo = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const ALLOWED_FORMATS = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (selectedFile) => {
    setError(null);

    if (!selectedFile) {
      setError('Please select a video file');
      return false;
    }

    if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload MP4, MOV, or AVI files only.');
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    setSuccess(false);
    setVideoUrl(null);

    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file first');
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // Simulate progress for better UX (Cloudinary uploads don't provide progress events)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const res = await API.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(Math.min(percentCompleted, 90));
          }
        },
      });

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      setError(null);

      // Pass video URL to parent component
      if (onUpload && res.data?.url) {
        onUpload(res.data.url);
      }

      // Clean up preview URL after a delay
      setTimeout(() => {
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
      }, 2000);
    } catch (err) {
      console.error('Video upload error:', err);
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Video upload failed. Please try again.';
      setError(errorMessage);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Course Video
        </label>
        <p className="text-xs text-gray-500 mb-4">
          Supported formats: MP4, MOV, AVI • Max size: {formatFileSize(MAX_FILE_SIZE)}
        </p>

        {/* Drag and Drop Area */}
        {!file && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-300
              ${isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/avi,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isDragging
                    ? 'bg-blue-500 text-white scale-110'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragging ? 'Drop video here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a video file to upload
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selected File Preview */}
        {file && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileVideo className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={handleRemove}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Video Preview */}
            {videoUrl && (
              <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full max-h-64 object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-600" />
                    Uploading...
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-800">
                  Video uploaded successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            {!uploading && !success && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5" />
                  Upload Video
                </button>
                <button
                  onClick={handleBrowseClick}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Change File
                </button>
              </div>
            )}

            {success && (
              <button
                onClick={handleRemove}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Upload Another Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
