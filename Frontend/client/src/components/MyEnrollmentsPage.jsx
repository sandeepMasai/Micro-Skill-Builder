import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments } from '../services/enrollmentService';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Play,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import moment from 'moment';

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const enrollmentsPerPage = 6;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyEnrollments();
        // Handle both array and object with enrollments property
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.enrollments || [];
        setEnrollments(data);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
        setError(err.response?.data?.error || 'Failed to load your enrollments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Pagination
  const indexOfLast = currentPage * enrollmentsPerPage;
  const indexOfFirst = indexOfLast - enrollmentsPerPage;
  const currentEnrollments = enrollments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(enrollments.length / enrollmentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'from-green-500 to-emerald-600';
    if (progress >= 50) return 'from-blue-500 to-cyan-600';
    if (progress >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStatusBadge = (isCompleted, progress) => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (progress > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
          <Clock className="w-3 h-3" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg">
        <BookOpen className="w-3 h-3" />
        Not Started
      </span>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              My Enrollments
            </h1>
            <p className="text-gray-600 text-lg">Track your learning journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Enrollments Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey by exploring our amazing courses!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            My Enrollments
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            {enrollments.length} {enrollments.length === 1 ? 'Course' : 'Courses'} Enrolled
          </p>
        </div>

        {/* Enrollments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentEnrollments.map((enrollment, index) => {
            const course = enrollment.courseId;
            if (!course) return null;

            const imageUrl = course.coverImage?.startsWith('/')
              ? `https://micro-skill-builder.onrender.com${course.coverImage}`
              : course.coverImage || '';

            const progress = enrollment.progress ?? 0;
            const isCompleted = enrollment.isCompleted || progress === 100;

            return (
              <div
                key={enrollment._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Fallback Image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 text-center items-center justify-center hidden">
                    <BookOpen className="w-16 h-16 text-blue-400 mx-auto" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(isCompleted, progress)}
                  </div>

                  {/* Progress Overlay */}
                  {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between text-white text-xs mb-2">
                        <span className="font-semibold">Progress</span>
                        <span className="font-bold">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 rounded-full`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title || 'Untitled Course'}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    {/* Progress Bar */}
                    {progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Progress
                          </span>
                          <span className="font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 rounded-full`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Start Date */}
                    {enrollment.startDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>
                          Started {moment(enrollment.startDate).format('MMM DD, YYYY')}
                        </span>
                      </div>
                    )}

                    {/* Completed Date */}
                    {enrollment.completedDate && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Award className="w-4 h-4" />
                        <span>
                          Completed {moment(enrollment.completedDate).format('MMM DD, YYYY')}
                        </span>
                      </div>
                    )}

                    {/* Completed Days */}
                    {enrollment.completedDays && enrollment.completedDays.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span>
                          {enrollment.completedDays.length} Day{enrollment.completedDays.length !== 1 ? 's' : ''} Completed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/course/${course._id || enrollment.courseId}`}
                    className="block w-full"
                  >
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/btn">
                      <Play className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:bg-white flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                      }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:bg-white flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollmentsPage;
