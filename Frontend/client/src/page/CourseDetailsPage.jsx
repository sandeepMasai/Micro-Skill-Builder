import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../Api/axios';
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Video,
  Download,
  File,
  Clock,
  Target,
  Award,
  ChevronRight,
  ChevronLeft,
  Loader,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [dayContent, setDayContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    if (course && enrollment) {
      // Set current day to first incomplete day or last day
      const completedDays = enrollment.completedDays || [];
      const nextDay = completedDays.length > 0 
        ? Math.max(...completedDays) + 1 
        : 1;
      setCurrentDay(Math.min(nextDay, course.days?.length || 1));
      fetchDayContent(Math.min(nextDay, course.days?.length || 1));
    }
  }, [course, enrollment]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseRes = await API.get(`/courses/${courseId}`);
      setCourse(courseRes.data);

      // Fetch enrollment details
      try {
        const enrollmentRes = await API.get('/enrollments/my-enrollments');
        const enrollments = Array.isArray(enrollmentRes.data)
          ? enrollmentRes.data
          : enrollmentRes.data?.enrollments || [];
        const userEnrollment = enrollments.find(
          e => (e.courseId?._id || e.courseId) === courseId
        );
        setEnrollment(userEnrollment);
      } catch (err) {
        console.error('Failed to fetch enrollment:', err);
      }
    } catch (err) {
      console.error('Failed to load course:', err);
      setError(err.response?.data?.error || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDayContent = async (dayNumber) => {
    try {
      setLoadingDay(true);
      setError(null);
      setQuizSubmitted(false);
      setQuizResult(null);
      setQuizAnswer(null);

      const res = await API.get(`/content/${courseId}/day/${dayNumber}`);
      setDayContent(res.data);
      setCurrentDay(dayNumber);
    } catch (err) {
      console.error('Failed to load day content:', err);
      setError(err.response?.data?.error || 'Failed to load day content');
    } finally {
      setLoadingDay(false);
    }
  };

  const handleDayClick = (dayNumber) => {
    const completedDays = enrollment?.completedDays || [];
    if (dayNumber === 1 || completedDays.includes(dayNumber - 1)) {
      fetchDayContent(dayNumber);
    }
  };

  const handleQuizSubmit = async () => {
    if (quizAnswer === null) {
      setError('Please select an answer');
      return;
    }

    try {
      const res = await API.post(`/content/${courseId}/day/${currentDay}/quiz`, {
        selectedAnswer: quizAnswer
      });
      setQuizResult(res.data);
      setQuizSubmitted(true);
      
      // Refresh enrollment to get updated progress
      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError(err.response?.data?.error || 'Failed to submit quiz');
    }
  };

  const markDayComplete = async () => {
    try {
      await API.patch('/enrollments/progress', {
        courseId,
        dayNumber: currentDay,
        completed: true
      });
      // Refresh enrollment
      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to mark day complete:', err);
    }
  };

  const completedDays = enrollment?.completedDays || [];
  const progress = enrollment?.progress || 0;
  const isDayCompleted = completedDays.includes(currentDay);
  const canAccessDay = currentDay === 1 || completedDays.includes(currentDay - 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/my-enrollments')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Enrollments
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const courseImage = course.coverImage?.startsWith('/')
    ? `https://micro-skill-builder.onrender.com${course.coverImage}`
    : course.coverImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/my-enrollments')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Enrollments</span>
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {courseImage && (
              <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src={courseImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-white/90 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{course.instructor.name}</span>
                  </div>
                )}
                {course.category && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{course.days?.length || 0} Days</span>
                </div>
              </div>

              {/* Progress Bar */}
              {enrollment && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Days Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Course Days
              </h2>
              <div className="space-y-2">
                {course.days?.map((day, index) => {
                  const dayNum = day.dayNumber || index + 1;
                  const isCompleted = completedDays.includes(dayNum);
                  const isLocked = dayNum > 1 && !completedDays.includes(dayNum - 1);
                  const isActive = currentDay === dayNum;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => !isLocked && handleDayClick(dayNum)}
                      disabled={isLocked}
                      className={`
                        w-full text-left p-3 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isLocked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-current"></div>
                          )}
                          <span className="font-medium">Day {dayNum}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </div>
                      <p className="text-xs mt-1 opacity-75 truncate">
                        {day.title || `Day ${dayNum} Content`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loadingDay ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading day content...</p>
              </div>
            ) : dayContent ? (
              <div className="space-y-6">
                {/* Day Header */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {dayContent.dayContent?.title || `Day ${currentDay}`}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Day {currentDay} of {course.days?.length || 0}
                      </p>
                    </div>
                    {isDayCompleted && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>

                  {!canAccessDay && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                      <Lock className="w-5 h-5 text-yellow-600" />
                      <p className="text-yellow-800">
                        Complete the previous day to unlock this content
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Content */}
                {dayContent.dayContent?.content?.videoUrl && (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gray-900 aspect-video">
                      <video
                        src={dayContent.dayContent.content.videoUrl}
                        controls
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                {dayContent.dayContent?.content?.text && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Content
                    </h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                      {dayContent.dayContent.content.text}
                    </div>
                  </div>
                )}

                {/* Quiz Section */}
                {dayContent.dayContent?.content?.quiz && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Quiz
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 font-medium">
                        {dayContent.dayContent.content.quiz.question}
                      </p>
                      <div className="space-y-2">
                        {dayContent.dayContent.content.quiz.options?.map((option, index) => (
                          <label
                            key={index}
                            className={`
                              flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${quizAnswer === index
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }
                              ${quizSubmitted && index === dayContent.dayContent.content.quiz.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : ''
                              }
                              ${quizSubmitted && quizAnswer === index && index !== dayContent.dayContent.content.quiz.correctAnswer
                                ? 'border-red-500 bg-red-50'
                                : ''
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="quiz"
                              value={index}
                              checked={quizAnswer === index}
                              onChange={(e) => setQuizAnswer(parseInt(e.target.value))}
                              disabled={quizSubmitted}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="flex-1">{option}</span>
                            {quizSubmitted && index === dayContent.dayContent.content.quiz.correctAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </label>
                        ))}
                      </div>
                      {!quizSubmitted ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={quizAnswer === null}
                          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                          <p className="font-semibold text-blue-800">
                            {quizResult?.correct
                              ? '✓ Correct! You earned ' + (quizResult?.xpAwarded || 0) + ' XP'
                              : '✗ Incorrect. The correct answer is option ' + (dayContent.dayContent.content.quiz.correctAnswer + 1)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Complete Day Button */}
                {canAccessDay && !isDayCompleted && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <button
                      onClick={markDayComplete}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Day as Complete
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => currentDay > 1 && handleDayClick(currentDay - 1)}
                    disabled={currentDay === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous Day
                  </button>
                  <button
                    onClick={() => currentDay < (course.days?.length || 1) && handleDayClick(currentDay + 1)}
                    disabled={currentDay >= (course.days?.length || 1)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Next Day
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No content available for this day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;

