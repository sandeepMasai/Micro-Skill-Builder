import { useEffect, useState } from 'react';
import axios from 'axios';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://micro-skill-builder.onrender.com/api/users/leaderboard')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Rank</th>
            <th className="p-2">Name</th>
            <th className="p-2">XP</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((u, i) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
