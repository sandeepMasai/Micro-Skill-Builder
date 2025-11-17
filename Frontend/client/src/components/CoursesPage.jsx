import { useEffect, useState } from 'react';
import { getCourses } from '../services/courseService';
import { enrollInCourse, getMyEnrollments } from '../services/enrollmentService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../Api/axios';
import { BookOpen, Search, Filter, CheckCircle, Clock, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const coursesPerPage = 9;
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, categoryRes] = await Promise.all([
          getCourses(),
          API.get('/categories')
        ]);

        setCourses(courseRes.data?.courses || courseRes.data || []);
        setCategories(categoryRes.data || []);

        if (user) {
          try {
            const enrollments = await getMyEnrollments();
            const enrolledIds = (enrollments.data?.enrollments || enrollments.data || []).map(e =>
              e.course?._id || e.courseId || e._id
            );
            setEnrolledCourseIds(enrolledIds);
          } catch (err) {
            console.error('Failed to load enrollments:', err);
            // Don't fail the whole page if enrollments fail
          }
        }
      } catch (err) {
        console.error('Failed to load courses or categories:', err);
        setError(err.response?.data?.error || 'Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrollingId(courseId);
      setSuccessMessage('');
      await enrollInCourse(courseId);
      setEnrolledCourseIds(prev => [...prev, courseId]);
      setSuccessMessage('Successfully enrolled in course!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Enrollment error:', err);
      const errorMsg = err.response?.data?.error || 'Enrollment failed. Please try again.';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setEnrollingId(null);
    }
  };

  // Filter courses by category and search query
  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory ||
      course.category?._id === selectedCategory ||
      course.category === selectedCategory;

    const matchesSearch = !searchQuery ||
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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

  // Loading skeleton component
  const CourseSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
      <p className="text-gray-500 mb-6">
        {searchQuery || selectedCategory
          ? 'Try adjusting your filters or search query.'
          : 'There are no courses available at the moment.'}
      </p>
      {(searchQuery || selectedCategory) && (
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('');
          }}
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
        >
          <Filter className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Courses</h1>
            <p className="text-gray-600">Discover amazing learning opportunities</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Explore Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing learning opportunities and enhance your skills with our curated courses
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 animate-slide-down">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 animate-slide-down">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 font-bold text-lg"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedCourses.length} of {filteredCourses.length} courses
          </div>
        </div>

        {/* Courses Grid */}
        {paginatedCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCourses.map(course => {
                const alreadyEnrolled = enrolledCourseIds.includes(course._id);
                const isEnrolling = enrollingId === course._id;
                const courseImage = course.coverImage?.startsWith('/')
                  ? `https://micro-skill-builder.onrender.com${course.coverImage}`
                  : course.coverImage;

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
                      {courseImage ? (
                        <img
                          src={courseImage}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-white opacity-50" />
                        </div>
                      )}

                      {/* Status Badge */}
                      {course.isPublished !== false && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Published
                          </span>
                        </div>
                      )}

                      {/* Enrolled Badge */}
                      {alreadyEnrolled && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Enrolled
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      {/* Category */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {course.category?.name || 'Uncategorized'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {course.title || 'Untitled Course'}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {course.description || 'No description available'}
                      </p>

                      {/* Course Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>5 Days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Beginner</span>
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={alreadyEnrolled || isEnrolling}
                        className={`group relative w-full px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${alreadyEnrolled
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 cursor-not-allowed shadow-sm'
                          : isEnrolling
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-wait shadow-lg'
                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
                          }`}
                      >
                        {isEnrolling ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span className="relative z-10">Enrolling...</span>
                          </>
                        ) : alreadyEnrolled ? (
                          <>
                            <CheckCircle className="h-5 w-5 relative z-10" />
                            <span className="relative z-10">Already Enrolled</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="relative z-10">Enroll Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="group relative px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-semibold text-gray-700 hover:text-blue-600"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Previous</span>
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 ${currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-offset-2'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                        >
                          <span className="relative z-10">{page}</span>
                          {currentPage === page && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
                          )}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-3 py-2.5 text-gray-400 font-semibold">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="group relative px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-semibold text-gray-700 hover:text-blue-600"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
