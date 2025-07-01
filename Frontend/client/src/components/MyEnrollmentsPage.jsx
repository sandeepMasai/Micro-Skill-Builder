import { useEffect, useState } from 'react';
import { getMyEnrollments } from '../services/enrollmentService';

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const [currentPage, setCurrentPage] = useState(1);
  const enrollmentsPerPage = 4;

  useEffect(() => {
    getMyEnrollments()
      .then((res) => {
        setEnrollments(res.data);
      })
      .catch(() => {
        setError('Failed to load your enrollments');
      })
      .finally(() => setLoading(false));
  }, []);

  //  pagination
  const indexOfLast = currentPage * enrollmentsPerPage;
  const indexOfFirst = indexOfLast - enrollmentsPerPage;
  const currentEnrollments = enrollments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(enrollments.length / enrollmentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p className="text-center mt-10">Loading your enrollments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Enrollments</h2>
      {enrollments.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEnrollments.map((enrollment) => {
              const course = enrollment.courseId;

              if (!course) return null;

              const imageUrl = course.coverImage?.startsWith('/')
                ? `https://micro-skill-builder.onrender.com${course.coverImage}`
                : course.coverImage;

              return (
                <div key={enrollment._id} className="border rounded-lg p-4 shadow bg-white">
                  {course.coverImage ? (
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  <div className="w-full h-40 bg-gray-100 text-center items-center justify-center hidden rounded">
                    <span className="text-gray-500">Image not available</span>
                  </div>

                  <h3 className="text-lg font-semibold mt-2">{course.title || 'Untitled Course'}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description || 'No description available'}</p>
                  <p className="text-sm text-gray-600 mb-2">{course.category || 'Uncategorized'}</p>
                  <p className="text-sm">
                    <strong>Progress:</strong> {enrollment.progress ?? 0}%
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong> {enrollment.isCompleted ? 'Completed' : 'In Progress'}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Start Date:</strong>{' '}
                    {enrollment.startDate ? new Date(enrollment.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;
