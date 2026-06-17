/* eslint-disable react/no-danger */
/**
 * components/CommentItem.jsx
 * Menampilkan satu komentar lengkap dengan info user dan tombol vote.
 */

import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import VoteButton from './VoteButton';
import {
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from '../states/threadDetail';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const handleUpVote = () => dispatch(
    asyncToggleUpVoteComment({ threadId, commentId: comment.id }),
  );
  const handleDownVote = () => dispatch(
    asyncToggleDownVoteComment({ threadId, commentId: comment.id }),
  );

  return (
    <article className="comment-item">
      <div className="comment-item__header">
        <img
          src={comment.owner.avatar}
          alt={`Avatar ${comment.owner.name}`}
          className="comment-item__avatar"
          onError={({ currentTarget }) => {
            // eslint-disable-next-line no-param-reassign
            currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.owner.name)}&background=random`;
          }}
        />
        <div className="comment-item__meta">
          <span className="comment-item__owner">{comment.owner.name}</span>
          <span className="comment-item__date">{formatDate(comment.createdAt)}</span>
        </div>
      </div>

      <div
        className="comment-item__content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />

      <VoteButton
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        authUserId={authUser?.id}
        onUpVote={handleUpVote}
        onDownVote={handleDownVote}
      />
    </article>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
