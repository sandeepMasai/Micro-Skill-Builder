import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  BookOpen,
  GraduationCap,
  Trophy,
  PlusCircle,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenus}
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span
              className={`text-xl font-bold transition-colors ${isScrolled
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                : 'text-white'
                }`}
            >
              SkillForge
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                  ? isScrolled
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/20 text-white backdrop-blur-sm'
                  : isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-enrollments"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                      ? isScrolled
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10'
                    }`
                  }
                >
                  <GraduationCap className="w-4 h-4" />
                  My Enrollments
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                      ? isScrolled
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10'
                    }`
                  }
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </NavLink>
              </>
            )}

            {user && ['admin', 'instructor'].includes(user.role) && (
              <NavLink
                to="/courses/create"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? isScrolled
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/20 text-white backdrop-blur-sm'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white/90 hover:bg-white/10'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4" />
                Create Course
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin/courses"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? isScrolled
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/20 text-white backdrop-blur-sm'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white/90 hover:bg-white/10'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side - Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ring-2 ring-white/50">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-white font-medium hidden lg:block">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-20 border border-gray-100 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.role && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/e-profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                      ? 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isActive
                      ? 'bg-white text-blue-600'
                      : isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${isScrolled
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-white hover:bg-white/10'
              }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-md animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <NavLink
              to="/courses"
              onClick={closeMenus}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <BookOpen className="w-5 h-5" />
              Courses
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-enrollments"
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <GraduationCap className="w-5 h-5" />
                  My Enrollments
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <User className="w-5 h-5" />
                  Profile
                </NavLink>
              </>
            )}

            {user && ['admin', 'instructor'].includes(user.role) && (
              <NavLink
                to="/courses/create"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <PlusCircle className="w-5 h-5" />
                Create Course
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin/courses"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5" />
                Admin Dashboard
              </NavLink>
            )}

            {user ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <NavLink
                  to="/login"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
