/**
 * components/CommentInput.jsx
 * Form untuk menambah komentar baru.
 * Hanya tampil jika user sudah login.
 * Menggunakan local state (useState) untuk input controlled component.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncCreateComment } from '../states/threadDetail';

function CommentInput({ threadId }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  // Local state untuk input komentar (diizinkan oleh aturan arsitektur)
  const [content, setContent] = useState('');

  if (!authUser) {
    return (
      <div className="comment-input__login-prompt">
        <p>
          <Link to="/login">Login</Link>
          {' '}
          untuk menambahkan komentar.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    dispatch(asyncCreateComment({ threadId, content }));
    setContent('');
  };

  return (
    <form className="comment-input" onSubmit={handleSubmit}>
      <h3 className="comment-input__title">Tambah Komentar</h3>
      <textarea
        id="comment-content"
        className="comment-input__textarea"
        placeholder="Tulis komentar Anda di sini..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <button
        type="submit"
        className="btn btn--primary"
        disabled={!content.trim()}
      >
        Kirim Komentar
      </button>
    </form>
  );
}

CommentInput.propTypes = {
  threadId: PropTypes.string.isRequired,
};

export default CommentInput;
