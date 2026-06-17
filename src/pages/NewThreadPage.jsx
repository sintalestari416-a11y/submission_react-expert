/**
 * pages/NewThreadPage.jsx
 * Halaman buat thread baru (Protected Route — harus login).
 * Menggunakan local state untuk form input.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncCreateThread, asyncGetAllThreads } from '../states/threads';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state form (controlled component — diizinkan)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newThread = await dispatch(asyncCreateThread({ title, body, category }));
    if (newThread) {
      // Refresh daftar thread lalu navigasi ke home
      dispatch(asyncGetAllThreads());
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="page-container">
      <div className="new-thread-page">
        <h1 className="new-thread-page__title">Buat Thread Baru</h1>
        <p className="new-thread-page__subtitle">
          Bagikan ide, pertanyaan, atau topik diskusi menarik kepada komunitas.
        </p>

        <form className="new-thread-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="thread-title" className="form-label">
              Judul Thread
              {' '}
              <span className="required">*</span>
            </label>
            <input
              id="thread-title"
              type="text"
              className="form-input"
              placeholder="Masukkan judul thread yang menarik..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
            <span className="form-hint">
              {title.length}
              /120
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="thread-category" className="form-label">Kategori</label>
            <input
              id="thread-category"
              type="text"
              className="form-input"
              placeholder="Contoh: teknologi, sains, hiburan"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thread-body" className="form-label">
              Konten Thread
              {' '}
              <span className="required">*</span>
            </label>
            <textarea
              id="thread-body"
              className="form-input form-textarea"
              placeholder="Tulis konten thread Anda secara detail..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
            />
          </div>

          <div className="new-thread-form__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!title.trim() || !body.trim()}
            >
              Publikasikan Thread
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default NewThreadPage;
