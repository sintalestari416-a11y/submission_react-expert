/**
 * components/Navigation.jsx
 * Navbar utama dengan link navigasi dan tombol login/logout.
 */

import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLogoutUser } from '../states/authUser';

function Navigation() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const handleLogout = () => {
    dispatch(asyncLogoutUser());
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          💬 Forum Diskusi
        </Link>
      </div>

      <ul className="navbar__links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
          >
            Beranda
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/leaderboards"
            className={({ isActive }) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
          >
            Leaderboard
          </NavLink>
        </li>
        {authUser && (
          <li>
            <NavLink
              to="/new"
              className={({ isActive }) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
            >
              + Buat Thread
            </NavLink>
          </li>
        )}
      </ul>

      <div className="navbar__auth">
        {authUser ? (
          <div className="navbar__user">
            <img
              src={authUser.avatar}
              alt={`Avatar ${authUser.name}`}
              className="navbar__avatar"
              onError={({ currentTarget }) => {
                // eslint-disable-next-line no-param-reassign
                currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}&background=random`;
              }}
            />
            <span className="navbar__username">{authUser.name}</span>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar__auth-links">
            <Link to="/login" className="btn btn--secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn--primary">
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
