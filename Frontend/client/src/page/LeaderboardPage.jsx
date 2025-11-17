import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  User,
  Zap,
  Target,
  Sparkles,
  Loader,
  AlertCircle
} from 'lucide-react';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getLeaderboard();
        // Handle both response formats
        const data = res.data?.leaderboard || res.data || [];
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError(err.response?.data?.error || 'Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevel = (xp) => {
    if (xp >= 1000) return { name: 'Expert', color: 'from-green-500 to-emerald-600' };
    if (xp >= 500) return { name: 'Advanced', color: 'from-orange-500 to-red-600' };
    if (xp >= 250) return { name: 'Intermediate', color: 'from-blue-500 to-cyan-600' };
    if (xp >= 100) return { name: 'Beginner', color: 'from-purple-500 to-pink-600' };
    return { name: 'Novice', color: 'from-gray-400 to-gray-500' };
  };

  const getUserRank = () => {
    if (!user) return null;
    const index = leaderboard.findIndex((u) => u._id === user._id);
    return index !== -1 ? index + 1 : null;
  };

  const userRank = getUserRank();
  const userData = user ? leaderboard.find((u) => u._id === user._id) : null;

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Leaderboard
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Top performers ranked by XP
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8 animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="relative mb-4">
                {leaderboard[1]?.avatar ? (
                  <img
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center ring-4 ring-gray-300">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="absolute -top-2 -right-2 bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-4 w-full text-center shadow-lg">
                <p className="font-bold text-gray-800 truncate">{leaderboard[1]?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-1">{leaderboard[1]?.xp || 0} XP</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center animate-scale-in" style={{ animationDelay: '0ms' }}>
              <div className="relative mb-4">
                {leaderboard[0]?.avatar ? (
                  <img
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-yellow-400 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ring-4 ring-yellow-400 shadow-xl">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-4 w-full text-center shadow-xl">
                <p className="font-bold text-white truncate">{leaderboard[0]?.name || 'N/A'}</p>
                <p className="text-sm text-white/90 mt-1">{leaderboard[0]?.xp || 0} XP</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="relative mb-4">
                {leaderboard[2]?.avatar ? (
                  <img
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-600"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center ring-4 ring-amber-600">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg p-4 w-full text-center shadow-lg">
                <p className="font-bold text-white truncate">{leaderboard[2]?.name || 'N/A'}</p>
                <p className="text-sm text-white/90 mt-1">{leaderboard[2]?.xp || 0} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Full Rankings
            </h2>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No users on the leaderboard yet</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to earn XP and climb the ranks!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((userItem, index) => {
                const rank = index + 1;
                const isCurrentUser = user && userItem._id === user._id;
                const level = getLevel(userItem.xp || 0);
                const badges = userItem.badges || [];

                return (
                  <div
                    key={userItem._id}
                    className={`
                      px-6 py-4 transition-all duration-200 hover:bg-gray-50
                      ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
                      animate-fade-in
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {rank <= 3 ? (
                          <div className="flex justify-center">{getRankIcon(rank)}</div>
                        ) : (
                          <span
                            className={`
                              inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                              ${getRankBadge(rank)}
                            `}
                          >
                            {rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {userItem.avatar ? (
                          <img
                            src={userItem.avatar}
                            alt={userItem.name}
                            className={`w-12 h-12 rounded-full object-cover ${isCurrentUser ? 'ring-2 ring-blue-600' : ''
                              }`}
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${isCurrentUser ? 'ring-2 ring-blue-600' : ''
                              }`}
                          >
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-semibold text-gray-900 truncate ${isCurrentUser ? 'text-blue-700' : ''}`}>
                            {userItem.name || 'Anonymous'}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${level.color} text-white`}
                          >
                            <Star className="w-3 h-3" />
                            {level.name}
                          </span>
                          {badges.length > 0 && (
                            <div className="flex items-center gap-1">
                              {badges.slice(0, 3).map((badge, idx) => (
                                <div
                                  key={idx}
                                  className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                                  title={badge}
                                >
                                  <Award className="w-3 h-3 text-white" />
                                </div>
                              ))}
                              {badges.length > 3 && (
                                <span className="text-xs text-gray-500">+{badges.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* XP */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="font-bold text-lg text-gray-900">{userItem.xp || 0}</p>
                            <p className="text-xs text-gray-500">XP</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Current User Rank Card (if not in top 10 or not in leaderboard) */}
        {user && userRank && userRank > 10 && userData && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Your Rank</p>
                  <p className="text-2xl font-bold">#{userRank}</p>
                  <p className="text-sm opacity-75 mt-1">{userData.xp || 0} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Keep learning to climb!</p>
                <p className="text-lg font-semibold mt-1">
                  {leaderboard[9]?.xp - (userData.xp || 0)} XP to top 10
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
