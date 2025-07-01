import { useEffect, useState } from 'react';
import { getCourses } from '../services/courseService';
import { enrollInCourse, getMyEnrollments } from '../services/enrollmentService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../Api/axios';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 6;
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourses();
        setCourses(courseRes.data.courses || []);

        const categoryRes = await API.get('/categories');
        setCategories(categoryRes.data || []);

        if (user) {
          const enrollments = await getMyEnrollments();
          const enrolledIds = (enrollments.data?.enrollments || []).map(e => e.course._id);
          setEnrolledCourseIds(enrolledIds);
        }
      } catch (err) {
        console.error('Failed to load courses or categories:', err);
        setError('Failed to load data.');
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await enrollInCourse(courseId);
      alert('Successfully enrolled!');
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err) {
      console.error(err);
      alert('Enrollment failed.');
    }
  };

  const filteredCourses = selectedCategory
    ? courses.filter(course =>
        course.category === selectedCategory || course.category?._id === selectedCategory
      )
    : courses;

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">All Courses</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); 
          }}
          className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedCourses.map(course => {
          const alreadyEnrolled = enrolledCourseIds.includes(course._id);

          return (
            <div key={course._id} className="border rounded-lg shadow hover:shadow-md transition bg-white">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                {course.coverImage ? (
                  <img
                    src={course.coverImage.startsWith('/')
                      ? `https://micro-skill-builder.onrender.com${course.coverImage}`
                      : course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm">Course</div>
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Category: {course.category?.name || course.category || 'Uncategorized'}
                </p>

                <button
                  onClick={() => handleEnroll(course._id)}
                  disabled={alreadyEnrolled}
                  className={`w-full px-4 py-2 rounded transition ${
                    alreadyEnrolled
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {alreadyEnrolled ? 'Already Enrolled' : 'Enroll in Course'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CoursesPage;

