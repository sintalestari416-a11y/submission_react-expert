/**
 * pages/LeaderboardsPage.jsx
 * Halaman klasemen pengguna paling aktif di forum.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetLeaderboards } from '../states/leaderboards';

function LeaderboardsPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(asyncGetLeaderboards());
  }, [dispatch]);

  return (
    <main className="page-container">
      <div className="leaderboards-page">
        <h1 className="leaderboards-page__title">🏆 Leaderboard</h1>
        <p className="leaderboards-page__subtitle">
          Pengguna paling aktif berkontribusi di Forum Diskusi.
        </p>

        {leaderboards.length === 0 ? (
          <p className="empty-state">Memuat data leaderboard...</p>
        ) : (
          <div className="leaderboards-table-wrapper">
            <table className="leaderboards-table">
              <thead>
                <tr>
                  <th className="leaderboards-table__th">Peringkat</th>
                  <th className="leaderboards-table__th">Pengguna</th>
                  <th className="leaderboards-table__th">Skor</th>
                </tr>
              </thead>
              <tbody>
                {leaderboards.map((item, index) => (
                  <tr
                    key={item.user.id}
                    className={`leaderboards-table__row ${index < 3 ? `leaderboards-table__row--top${index + 1}` : ''}`}
                  >
                    <td className="leaderboards-table__td leaderboards-table__td--rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="leaderboards-table__td">
                      <div className="leaderboards-user">
                        <img
                          src={item.user.avatar}
                          alt={`Avatar ${item.user.name}`}
                          className="leaderboards-user__avatar"
                          onError={({ currentTarget }) => {
                            // eslint-disable-next-line no-param-reassign
                            currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name)}&background=random`;
                          }}
                        />
                        <span className="leaderboards-user__name">{item.user.name}</span>
                      </div>
                    </td>
                    <td className="leaderboards-table__td leaderboards-table__td--score">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default LeaderboardsPage;
