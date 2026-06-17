/**
 * components/ThreadItem.jsx
 * Menampilkan satu item thread di daftar Home.
 * Berisi: Judul, Potongan isi, Waktu, Jumlah komentar, Nama & Avatar pembuat, Vote.
 */

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import VoteButton from './VoteButton';
import {
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from '../states/threads';

/** Format tanggal relatif */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Potong body menjadi preview */
function truncateBody(html, maxLength = 150) {
  const plain = html.replace(/<[^>]+>/g, '');
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}...` : plain;
}

function ThreadItem({ thread, users }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const owner = users.find((u) => u.id === thread.ownerId) || {
    name: 'Pengguna',
    avatar: 'https://ui-avatars.com/api/?name=U&background=random',
  };

  const handleUpVote = () => dispatch(asyncToggleUpVoteThread(thread.id));
  const handleDownVote = () => dispatch(asyncToggleDownVoteThread(thread.id));

  return (
    <article className="thread-item">
      <div className="thread-item__header">
        <img
          src={owner.avatar}
          alt={`Avatar ${owner.name}`}
          className="thread-item__avatar"
          onError={({ currentTarget }) => {
            // eslint-disable-next-line no-param-reassign
            currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=random`;
          }}
        />
        <div className="thread-item__meta">
          <span className="thread-item__owner">{owner.name}</span>
          <span className="thread-item__date">{formatDate(thread.createdAt)}</span>
        </div>
        {thread.category && (
          <span className="thread-item__category">{thread.category}</span>
        )}
      </div>

      <Link to={`/threads/${thread.id}`} className="thread-item__title-link">
        <h2 className="thread-item__title">{thread.title}</h2>
      </Link>

      <p className="thread-item__body">{truncateBody(thread.body)}</p>

      <div className="thread-item__footer">
        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          authUserId={authUser?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
        />
        <span className="thread-item__comments">
          💬
          {' '}
          {thread.totalComments}
          {' '}
          komentar
        </span>
      </div>
    </article>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ThreadItem;
