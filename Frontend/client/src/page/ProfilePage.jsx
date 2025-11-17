import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  User,
  Mail,
  Award,
  Trophy,
  Star,
  BookOpen,
  Edit,
  Calendar,
  TrendingUp,
  Target,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import API from '../Api/axios';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user) {
        try {
          const res = await API.get('/enrollments/my-enrollments');
          setEnrollments(res.data?.enrollments || res.data || []);
        } catch (err) {
          console.error('Failed to load enrollments:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEnrollments();
  }, [user]);

  const getLevel = (xp) => {
    if (xp >= 1000) return { name: 'Expert', color: 'from-green-500 to-emerald-600', icon: Trophy };
    if (xp >= 500) return { name: 'Advanced', color: 'from-orange-500 to-red-600', icon: Award };
    if (xp >= 250) return { name: 'Intermediate', color: 'from-yellow-500 to-orange-500', icon: Star };
    return { name: 'Beginner', color: 'from-blue-500 to-indigo-600', icon: Target };
  };

  const getProgressPercent = (xp) => {
    if (xp >= 1000) return 100;
    const nextLevel = xp < 250 ? 250 : xp < 500 ? 500 : 1000;
    const currentLevel = xp < 250 ? 0 : xp < 500 ? 250 : 500;
    return Math.min(100, ((xp - currentLevel) / (nextLevel - currentLevel)) * 100);
  };

  const getNextLevelXP = (xp) => {
    if (xp >= 1000) return null;
    if (xp < 250) return 250;
    if (xp < 500) return 500;
    return 1000;
  };

  const level = getLevel(user?.xp || 0);
  const progress = getProgressPercent(user?.xp || 0);
  const nextLevelXP = getNextLevelXP(user?.xp || 0);
  const LevelIcon = level.icon;

  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-lg text-gray-600">Manage your account and track your learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Profile Header with Gradient */}
              <div className={`bg-gradient-to-br ${level.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-5xl font-bold uppercase border-4 border-white shadow-2xl">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <LevelIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>

                  {/* Name and Role */}
                  <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full capitalize">
                      {user?.role || 'Student'}
                    </span>
                  </div>

                  {/* Level Badge */}
                  <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full`}>
                    <LevelIcon className="h-5 w-5" />
                    <span className="font-semibold">{level.name}</span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                {/* XP Display */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold text-gray-700">Total XP</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{user?.xp || 0}</span>
                  </div>

                  {/* Progress Bar */}
                  {nextLevelXP && (
                    <>
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                        <div
                          className={`bg-gradient-to-r ${level.color} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{progress.toFixed(0)}% Complete</span>
                        <span>{nextLevelXP - (user?.xp || 0)} XP to next level</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{inProgressCourses}</div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm break-all">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      Joined {moment(user?.createdAt || user?.joinedAt).format('MMM DD, YYYY')}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <Link
                  to="/e-profile"
                  className="group w-full mt-6"
                >
                  <button className="relative w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 overflow-hidden">
                    <Edit className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Edit Profile</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Badges Section */}
            {user?.badges && user.badges.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Badges
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {user.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-3 text-center border border-yellow-200 transform hover:scale-110 transition-transform duration-300"
                    >
                      <Award className="h-8 w-8 text-yellow-600 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-gray-700">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            {user?.bio && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-6 w-6 text-blue-600" />
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                  My Courses
                </h3>
                <Link
                  to="/courses"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  Browse More
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading courses...</p>
                </div>
              ) : enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => {
                    const course = enrollment.course || enrollment;
                    const progress = enrollment.progress || 0;
                    const isCompleted = progress === 100;

                    return (
                      <div
                        key={enrollment._id || course._id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-4">
                          {/* Course Image/Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            {course.coverImage ? (
                              <img
                                src={course.coverImage.startsWith('/')
                                  ? `https://micro-skill-builder.onrender.com${course.coverImage}`
                                  : course.coverImage}
                                alt={course.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <BookOpen className="h-8 w-8 text-white" />
                            )}
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 line-clamp-1">
                                {course.title || 'Untitled Course'}
                              </h4>
                              {isCompleted && (
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {course.description || 'No description available'}
                            </p>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Progress</span>
                                <span className="font-semibold">{progress}%</span>
                              </div>
                              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${isCompleted
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                    }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No courses yet</h4>
                  <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
                  <Link to="/courses">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Browse Courses
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Statistics Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Learning Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{user?.xp || 0}</div>
                  <div className="text-sm text-indigo-100">Total XP</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{completedCourses}</div>
                  <div className="text-sm text-indigo-100">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{inProgressCourses}</div>
                  <div className="text-sm text-indigo-100">In Progress</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{user?.badges?.length || 0}</div>
                  <div className="text-sm text-indigo-100">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
