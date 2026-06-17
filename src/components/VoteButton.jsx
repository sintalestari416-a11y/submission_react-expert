/**
 * components/VoteButton.jsx
 * Tombol vote (up/down) yang dapat digunakan di Thread dan Komentar.
 * Menampilkan warna aktif jika user sudah melakukan vote.
 */

import PropTypes from 'prop-types';

function VoteButton({
  upVotesBy,
  downVotesBy,
  authUserId,
  onUpVote,
  onDownVote,
}) {
  const isUpVoted = authUserId ? upVotesBy.includes(authUserId) : false;
  const isDownVoted = authUserId ? downVotesBy.includes(authUserId) : false;

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-btn ${isUpVoted ? 'vote-btn--active-up' : ''}`}
        onClick={onUpVote}
        aria-label="Up vote"
        title={isUpVoted ? 'Batalkan up vote' : 'Up vote'}
      >
        👍
        <span className="vote-count">{upVotesBy.length}</span>
      </button>
      <button
        type="button"
        className={`vote-btn ${isDownVoted ? 'vote-btn--active-down' : ''}`}
        onClick={onDownVote}
        aria-label="Down vote"
        title={isDownVoted ? 'Batalkan down vote' : 'Down vote'}
      >
        👎
        <span className="vote-count">{downVotesBy.length}</span>
      </button>
    </div>
  );
}

VoteButton.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

VoteButton.defaultProps = {
  authUserId: null,
};

export default VoteButton;
