import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  GraduationCap,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters long');
      return false;
    }

    if (!email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { success, message } = await register(name.trim(), email.trim(), password, role);

    if (success) {
      setSuccessMessage(message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMessage(message || 'Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SkillForge
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Join SkillForge
          </h1>
          <p className="text-gray-600">
            Start your learning journey today
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-green-800 flex-1">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 flex-1">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-red-600 hover:text-red-800"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${role === 'student'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setErrorMessage('');
                    }}
                    disabled={isLoading}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <GraduationCap className={`w-5 h-5 ${role === 'student' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className={`font-medium ${role === 'student' ? 'text-purple-700' : 'text-gray-700'}`}>
                      Student
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">I want to learn</p>
                  </div>
                  {role === 'student' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                </label>

                <label
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${role === 'instructor'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={role === 'instructor'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setErrorMessage('');
                    }}
                    disabled={isLoading}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <User className={`w-5 h-5 ${role === 'instructor' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className={`font-medium ${role === 'instructor' ? 'text-green-700' : 'text-gray-700'}`}>
                      Instructor
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">I want to teach</p>
                  </div>
                  {role === 'instructor' && <CheckCircle className="w-5 h-5 text-green-600" />}
                </label>

                <label
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${role === 'admin'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setErrorMessage('');
                    }}
                    disabled={isLoading}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <ShieldCheck className={`w-5 h-5 ${role === 'admin' ? 'text-red-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className={`font-medium ${role === 'admin' ? 'text-red-700' : 'text-gray-700'}`}>
                      Admin
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">I manage the platform</p>
                  </div>
                  {role === 'admin' && <CheckCircle className="w-5 h-5 text-red-600" />}
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.strength === 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                        passwordStrength.strength === 3 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed bg-white ${confirmPassword && password !== confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : confirmPassword && password === confirmPassword
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-200 focus:border-purple-500'
                    }`}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            >
              Sign in instead
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-purple-600 hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-purple-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
