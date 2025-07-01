import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set initial values once user is available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    try {
      const { data } = await axios.patch('/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data);
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10 text-gray-600">Loading user data...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Bio</span>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows="4"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Avatar</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
