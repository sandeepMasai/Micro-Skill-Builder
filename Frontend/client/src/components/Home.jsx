import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Star,
  Trophy,
  Users,
  Zap,
  CheckCircle,
  TrendingUp,
  Award,
  PlayCircle,
  Target,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../Api/axios';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ courses: 0, students: 0, xp: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, leaderboardRes] = await Promise.all([
          API.get('/courses'),
          API.get('/users/leaderboard')
        ]);

        const courses = coursesRes.data?.courses || coursesRes.data || [];
        const leaderboard = leaderboardRes.data?.leaderboard || leaderboardRes.data || [];

        const totalXP = leaderboard.reduce((sum, u) => sum + (u.xp || 0), 0);

        setStats({
          courses: courses.length,
          students: leaderboard.length,
          xp: totalXP
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Gamified Micro-Learning Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 animate-scale-in">
              Master New Skills in
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Just 5 Days
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Transform your abilities with focused micro-courses designed for busy professionals.
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-fade-in">
              Learn through interactive content, earn XP, unlock badges, and build your skill portfolio one course at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-down">
              {isAuthenticated ? (
                <Link to="/courses" className="group">
                  <button className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      Explore Courses
                    </span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="group">
                    <button className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden">
                      <span className="relative z-10 flex items-center gap-3">
                        <Zap className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                        Start Learning Today
                      </span>
                      <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </button>
                  </Link>
                  <Link to="/courses" className="group">
                    <button className="relative px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 hover:bg-indigo-50">
                      <Calendar className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Browse Courses</span>
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.courses}+</div>
                <div className="text-sm text-gray-600">Available Courses</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.students}+</div>
                <div className="text-sm text-gray-600">Active Learners</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4 mx-auto">
                  <Trophy className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.xp.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Total XP Earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Micro-Skill-Builder</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience learning like never before with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">5-Day Format</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Structured learning paths that fit perfectly into your busy schedule. Complete a full course in just one week.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Gamified Learning</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Earn XP, unlock badges, climb the leaderboard, and track your progress. Make learning fun and engaging.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive Content</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Engaging videos, interactive quizzes, and peer reviews. Learn by doing, not just watching.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up & Explore</h3>
              <p className="text-gray-600">
                Create your free account and browse our extensive catalog of micro-courses
              </p>
            </div>

            {/* Connector Line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2"></div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
                <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20 animation-delay-2000"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enroll & Learn</h3>
              <p className="text-gray-600">
                Enroll in courses and unlock daily content. Complete quizzes to earn XP
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-20 animation-delay-4000"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn & Compete</h3>
              <p className="text-gray-600">
                Unlock badges, climb the leaderboard, and build your skill portfolio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering new skills with our platform
            </p>
            {!isAuthenticated ? (
              <Link to="/register" className="inline-block group">
                <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <Link to="/courses" className="inline-block group">
                <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <span>Browse Courses</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
