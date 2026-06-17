/**
 * components/ThreadList.jsx
 * Render daftar ThreadItem yang sudah difilter.
 */

import PropTypes from 'prop-types';
import ThreadItem from './ThreadItem';

function ThreadList({ threads, users }) {
  if (threads.length === 0) {
    return (
      <p className="empty-state">
        Belum ada thread. Jadilah yang pertama memulai diskusi! 🚀
      </p>
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} users={users} />
      ))}
    </div>
  );
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ThreadList;
