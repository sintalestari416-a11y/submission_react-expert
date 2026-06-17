/**
 * pages/RegisterPage.jsx
 * Halaman registrasi. Murni UI — tidak ada logika API di sini.
 * Semua pemanggilan API dilakukan melalui thunk asyncRegisterUser.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { asyncRegisterUser } from '../states/users';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state untuk form (controlled component — diizinkan)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await dispatch(asyncRegisterUser({ name, email, password }));
    if (success) {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login', { replace: true });
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Daftar Akun</h1>
        <p className="auth-card__subtitle">
          Bergabung dengan komunitas Forum Diskusi sekarang!
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register-name" className="form-label">
              Nama
            </label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              placeholder="Nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Buat Akun
          </button>
        </form>

        <p className="auth-card__footer">
          Sudah punya akun?
          {' '}
          <Link to="/login" className="auth-link">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
