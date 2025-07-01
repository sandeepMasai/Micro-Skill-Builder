import API from '../Api/axios';

export const getLeaderboard = () => API.get('/users/leaderboard');
