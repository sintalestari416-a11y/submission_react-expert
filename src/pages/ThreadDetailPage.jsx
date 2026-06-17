/* eslint-disable react/no-danger */
/**
 * pages/ThreadDetailPage.jsx
 * Halaman detail thread: konten lengkap, komentar, dan form tambah komentar.
 * Vote pada thread dan komentar bersifat optimistic.
 */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncGetThreadDetail,
  clearThreadDetail,
  asyncToggleUpVoteThreadDetail,
  asyncToggleDownVoteThreadDetail,
} from '../states/threadDetail';
import VoteButton from '../components/VoteButton';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const threadDetail = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));

    // Cleanup saat meninggalkan halaman
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, id]);

  if (!threadDetail) {
    return (
      <main className="page-container">
        <p className="loading-text">Memuat thread...</p>
      </main>
    );
  }

  const handleUpVote = () => dispatch(asyncToggleUpVoteThreadDetail(threadDetail.id));
  const handleDownVote = () => dispatch(asyncToggleDownVoteThreadDetail(threadDetail.id));

  return (
    <main className="page-container">
      <article className="thread-detail">
        {/* Header Thread */}
        <div className="thread-detail__header">
          <div className="thread-detail__owner-info">
            <img
              src={threadDetail.owner.avatar}
              alt={`Avatar ${threadDetail.owner.name}`}
              className="thread-detail__avatar"
              onError={({ currentTarget }) => {
                // eslint-disable-next-line no-param-reassign
                currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(threadDetail.owner.name)}&background=random`;
              }}
            />
            <div>
              <p className="thread-detail__owner-name">{threadDetail.owner.name}</p>
              <p className="thread-detail__date">{formatDate(threadDetail.createdAt)}</p>
            </div>
          </div>
          {threadDetail.category && (
            <span className="thread-item__category">{threadDetail.category}</span>
          )}
        </div>

        {/* Judul */}
        <h1 className="thread-detail__title">{threadDetail.title}</h1>

        {/* Konten HTML */}
        <div
          className="thread-detail__body"
          dangerouslySetInnerHTML={{ __html: threadDetail.body }}
        />

        {/* Vote Thread */}
        <VoteButton
          upVotesBy={threadDetail.upVotesBy}
          downVotesBy={threadDetail.downVotesBy}
          authUserId={authUser?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
        />
      </article>

      {/* Form Komentar */}
      <section className="comments-section">
        <h2 className="comments-section__title">
          {`Komentar (${threadDetail.comments.length})`}
        </h2>

        <CommentInput threadId={threadDetail.id} />

        <CommentList
          comments={threadDetail.comments}
          threadId={threadDetail.id}
        />
      </section>
    </main>
  );
}

export default ThreadDetailPage;
