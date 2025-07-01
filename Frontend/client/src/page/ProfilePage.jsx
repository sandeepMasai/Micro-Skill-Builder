import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ProfilePage = () => {
  const { user } = useAuth();

  const getLevel = (xp) => {
    if (xp >= 1000) return 'Expert';
    if (xp >= 500) return 'Advanced';
    if (xp >= 250) return 'Intermediate';
    return 'Beginner';
  };

  const getStars = (xp) => {
    const fullStars = Math.floor(xp / 250); 
    return '⭐'.repeat(fullStars || 1);
  };

  const getProgressPercent = (xp) => {
    if (xp >= 1000) return 100;
    return Math.min(100, (xp / 1000) * 100);
  };

  const level = getLevel(user?.xp || 0);
  const progress = getProgressPercent(user?.xp || 0);
  const stars = getStars(user?.xp || 0);

  const levelColors = {
    Beginner: 'bg-gray-400',
    Intermediate: 'bg-yellow-500',
    Advanced: 'bg-orange-500',
    Expert: 'bg-green-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-xl p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-34 h-34 rounded-full object-cover border-6 border-white shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}

          {/* Info */}
          <div className="w-full">
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold">Name:</span> {user?.name || 'N/A'}</p>
              <p><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
              <p><span className="font-semibold">Role:</span> {user?.role || 'User'}</p>
              <p><span className="font-semibold">XP:</span> {user?.xp ?? 0} {stars}</p>
              <div className="flex items-center space-x-2">
                <span className={`text-white px-3 py-1 rounded-full text-sm ${levelColors[level]}`}>
                  {level}
                </span>
                <p className="text-sm text-gray-500">{progress}% to Expert</p>
              </div>
              <p><span className="font-semibold">Joined:</span> {moment(user?.joinedAt).format('MMM DD, YYYY')}</p>
              <p><span className="font-semibold">Bio:</span> {user?.bio || 'No bio provided.'}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6">
              <Link
                to="/e-profile"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </Link>



   
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="bg-white mt-6 rounded-xl p-6 shadow">
          <h3 className="text-xl font-bold mb-4">🏅 Completed Courses</h3>
          {user?.completedCourses?.length ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {user.completedCourses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses completed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

