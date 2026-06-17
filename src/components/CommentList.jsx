/**
 * components/CommentList.jsx
 * Render daftar komentar dari sebuah thread.
 */

import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

function CommentList({ comments, threadId }) {
  if (comments.length === 0) {
    return (
      <p className="empty-state">
        Belum ada komentar. Jadilah yang pertama berkomentar!
      </p>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} threadId={threadId} />
      ))}
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentList;
