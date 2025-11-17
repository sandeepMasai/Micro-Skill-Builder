import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  ArrowRight,
  HelpCircle,
  FileText,
  Shield,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Footer() {
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-semibold">Join Our Learning Community</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are advancing their careers with our micro-learning approach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/courses" className="group">
                <button className="relative px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden">
                  <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Explore Courses</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="group">
                  <button className="relative px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden">
                    <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Start Learning Now</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </Link>
                {!user && (
                  <Link to="/register" className="group">
                    <button className="relative px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl text-lg hover:bg-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Become an Instructor</span>
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Micro-Skill-Builder
                </span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering professionals to master new skills through focused micro-learning experiences. Learn, grow, and excel in just 5 days.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/courses"
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>Courses</span>
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        to="/my-enrollments"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>My Enrollments</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/leaderboard"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>Leaderboard</span>
                      </Link>
                    </li>
                  </>
                )}
                {user && ['admin', 'instructor'].includes(user.role) && (
                  <li>
                    <Link
                      to="/courses/create"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span>Create Course</span>
                    </Link>
                  </li>
                )}
                {user?.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin/courses"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Account
              </h3>
              <ul className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/e-profile"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>Edit Profile</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>Login</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>Register</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-green-400" />
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@microskillbuilder.com"
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Contact Us</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>&copy; {currentYear} Micro-Skill-Builder. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
