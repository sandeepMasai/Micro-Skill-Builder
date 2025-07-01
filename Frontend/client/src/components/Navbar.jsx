

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className="text-xl font-bold hover:text-gray-100 transition duration-300"
          >
            🧠 Micro-Skill-Builder
          </NavLink>

          <NavLink to="/courses" className="hover:text-gray-200 transition duration-300">
            Courses
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-enrollments" className="hover:text-gray-200 transition duration-300">
                My Enrollments
              </NavLink>
              <NavLink to="/leaderboard" className="hover:text-gray-200 transition duration-300">
                Leaderboard
              </NavLink>
            </>
          )}

          {user && ['admin', 'instructor'].includes(user.role) && (
            <NavLink to="/courses/create" className="hover:text-gray-200 transition duration-300">
              Create Course
            </NavLink>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
             <Link to={'/profile'}>
              <span className="text-sm font-medium">Hello, {user.name}</span>
             </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-gray-200 transition duration-300">
                Login
              </NavLink>
              <NavLink to="/register" className="hover:text-gray-200 transition duration-300">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

