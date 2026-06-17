/**
 * pages/HomePage.jsx
 * Halaman utama: daftar thread + filter kategori.
 * Filter menggunakan local state (useState) — sisi client.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncGetAllThreads } from '../states/threads';
import { asyncGetAllUsers } from '../states/users';
import ThreadList from '../components/ThreadList';
import ThreadFilter from '../components/ThreadFilter';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);

  // Local state untuk filter kategori (tidak dari Redux, karena murni filter UI)
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    dispatch(asyncGetAllThreads());
    dispatch(asyncGetAllUsers());
  }, [dispatch]);

  // Ekstrak kategori unik dari threads
  const categories = [...new Set(threads.map((t) => t.category).filter(Boolean))];

  // Filter threads berdasarkan kategori yang dipilih
  const filteredThreads = activeCategory
    ? threads.filter((t) => t.category === activeCategory)
    : threads;

  return (
    <main className="page-container">
      <div className="home-header">
        <h1 className="home-header__title">Forum Diskusi</h1>
        <p className="home-header__subtitle">
          Temukan, baca, dan ikut berdiskusi topik menarik bersama komunitas.
        </p>
        <Link to="/new" className="btn btn--primary">
          + Buat Thread Baru
        </Link>
      </div>

      <ThreadFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <ThreadList threads={filteredThreads} users={users} />
    </main>
  );
}

export default HomePage;
