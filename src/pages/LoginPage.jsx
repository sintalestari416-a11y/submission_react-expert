/**
 * pages/LoginPage.jsx
 * Halaman login. Menggunakan local state untuk form input.
 * API call dilakukan melalui Thunk (asyncLoginUser), bukan di sini.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLoginUser } from '../states/authUser';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);

  // Local state untuk form (controlled component — diizinkan)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect jika sudah login
  if (authUser) {
    navigate('/', { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncLoginUser({ email, password }));
    // Hanya redirect jika login benar-benar berhasil (thunk mengembalikan user)
    if (result) {
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Masuk</h1>
        <p className="auth-card__subtitle">
          Selamat datang kembali! Silakan masuk ke akun Anda.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Masuk
          </button>
        </form>

        <p className="auth-card__footer">
          Belum punya akun?
          {' '}
          <Link to="/register" className="auth-link">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
