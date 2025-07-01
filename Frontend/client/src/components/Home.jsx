import React from 'react';
import { ArrowDown, Book, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master New Skills in
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              {' '}Just 5 Days
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Transform your abilities with focused micro-courses designed for busy professionals.
            Learn through interactive content, earn XP, and build your skill portfolio one course at a time.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link to="/login" aria-label="Start Learning">
              <button className="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-medium shadow-md transition">
                <Book className="w-5 h-5 mr-2" />
                Start Learning Today
              </button>
            </Link>
            <Link to="/courses" aria-label="Browse Courses">
              <button className="inline-flex items-center justify-center px-6 py-3 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md text-lg font-medium transition">
                <Calendar className="w-5 h-5 mr-2" />
                Browse Courses
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5-Day Format</h3>
              <p className="text-gray-600">Structured learning paths that fit your schedule.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gamified Learning</h3>
              <p className="text-gray-600">Earn XP, unlock badges, and track your progress.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Content</h3>
              <p className="text-gray-600">Videos, quizzes, and peer reviews.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pb-8">
        <ArrowDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
      </div>
    </div>
  );
};

export default Home;
