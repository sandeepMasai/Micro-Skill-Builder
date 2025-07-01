
import React, { useEffect, useState } from 'react';
import API from '../Api/axios';

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);          
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(data);
    } catch {
      setCourses([]);
      setError('Failed to load courses.');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data); 
    } catch {
      console.error('Could not load categories.');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await API.put(`/courses/${editingId}`, form);
        setCourses(prev => prev.map(c => (c._id === editingId ? res.data : c)));
      } else {
        const res = await API.post('/courses', form);
        setCourses(prev => [...prev, res.data]);
      }
      setForm({ title: '', description: '', category: '' });
      setEditingId(null);
    } catch {
      setError('Could not save course.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = course => {
    setForm({ title: course.title, description: course.description, category: course.category?._id || '' });
    setEditingId(course._id);
  };

  const handleCancel = () => setForm({ title: '', description: '', category: '' }) || setEditingId(null);

  const handleDelete = async id => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch {
      setError('Could not delete course.');
    }
  };

  const filtered = filterCat
    ? courses.filter(c => c.category?._id === filterCat)
    : courses;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md mb-10 space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? 'Edit Course' : 'Add New Course'}
        </h2>
        <input
          type="text" name="title" value={form.title}
          placeholder="Title" onChange={handleChange}
          required className="w-full border rounded-md px-3 py-2"
        />
        <textarea
          name="description" value={form.description}
          placeholder="Description" onChange={handleChange}
          rows="3" required className="w-full border rounded-md px-3 py-2"
        />
        <select
          name="category" value={form.category}
          onChange={handleChange} required
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-4">
          <button
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="text-gray-600 underline">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 shadow-md rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <select
          value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        {filtered.length > 0 ? (
          <ul className="space-y-4">
            {filtered.map(course => (
              <li key={course._id} className="border rounded-md p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>
                  <p className="text-sm text-gray-500">Category: {course.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <button onClick={() => handleEdit(course)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
