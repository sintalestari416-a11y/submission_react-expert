/**
 * App.jsx
 * Root komponen: setup routing, loading bar global, dan preload session.
 * Menggunakan React Strict Mode (diatur di main.jsx).
 */

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Toaster } from 'react-hot-toast';
import { asyncPreloadProcess } from './states/isPreload';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import NewThreadPage from './pages/NewThreadPage';
import LeaderboardsPage from './pages/LeaderboardsPage';

function App() {
  const dispatch = useDispatch();
  const isPreload = useSelector((state) => state.isPreload);

  // Cek session login satu kali saat aplikasi dimuat
  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  // Tampilkan layar kosong saat preload berlangsung
  if (isPreload) {
    return null;
  }

  return (
    <div className="app">
      {/* Loading bar global — muncul setiap ada proses async */}
      <LoadingBar
        style={{ backgroundColor: '#4f46e5', height: '3px', zIndex: 9999 }}
      />

      {/* Toast notification global */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'inherit' },
        }}
      />

      <Navigation />

      <div className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/threads/:id" element={<ThreadDetailPage />} />
          <Route
            path="/new"
            element={(
              <ProtectedRoute>
                <NewThreadPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
