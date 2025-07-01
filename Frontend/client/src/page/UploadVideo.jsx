import React, { useState } from 'react';
import axios from '../Api/axios';

const UploadVideo = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    try {
      const res = await axios.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload(res.data.url); // pass video url to parent
    } catch (err) {
      console.error(err);
      alert('Video upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label>Upload Course Video:</label>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};

export default UploadVideo;
