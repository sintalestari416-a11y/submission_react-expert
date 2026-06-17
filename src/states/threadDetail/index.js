/**
 * states/threadDetail/index.js
 * Slice untuk detail satu thread beserta komentar-komentarnya.
 * Semua operasi vote pada komentar juga bersifat optimistic.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    setThreadDetail: (_state, action) => action.payload,
    clearThreadDetail: () => null,

    // ─── Optimistic: Vote Thread Detail ──────────────────────────────────

    toggleUpVoteThreadDetail: (state, action) => {
      if (!state) return;
      const { userId } = action.payload;
      const upIndex = state.upVotesBy.indexOf(userId);
      const downIndex = state.downVotesBy.indexOf(userId);

      if (upIndex !== -1) {
        state.upVotesBy.splice(upIndex, 1);
      } else {
        state.upVotesBy.push(userId);
        if (downIndex !== -1) state.downVotesBy.splice(downIndex, 1);
      }
    },

    toggleDownVoteThreadDetail: (state, action) => {
      if (!state) return;
      const { userId } = action.payload;
      const downIndex = state.downVotesBy.indexOf(userId);
      const upIndex = state.upVotesBy.indexOf(userId);

      if (downIndex !== -1) {
        state.downVotesBy.splice(downIndex, 1);
      } else {
        state.downVotesBy.push(userId);
        if (upIndex !== -1) state.upVotesBy.splice(upIndex, 1);
      }
    },

    // ─── Optimistic: Vote Komentar ────────────────────────────────────────

    toggleUpVoteComment: (state, action) => {
      if (!state) return;
      const { commentId, userId } = action.payload;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;

      const upIndex = comment.upVotesBy.indexOf(userId);
      const downIndex = comment.downVotesBy.indexOf(userId);

      if (upIndex !== -1) {
        comment.upVotesBy.splice(upIndex, 1);
      } else {
        comment.upVotesBy.push(userId);
        if (downIndex !== -1) comment.downVotesBy.splice(downIndex, 1);
      }
    },

    toggleDownVoteComment: (state, action) => {
      if (!state) return;
      const { commentId, userId } = action.payload;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;

      const downIndex = comment.downVotesBy.indexOf(userId);
      const upIndex = comment.upVotesBy.indexOf(userId);

      if (downIndex !== -1) {
        comment.downVotesBy.splice(downIndex, 1);
      } else {
        comment.downVotesBy.push(userId);
        if (upIndex !== -1) comment.upVotesBy.splice(upIndex, 1);
      }
    },

    // ─── Tambah komentar baru ─────────────────────────────────────────────

    addComment: (state, action) => {
      if (!state) return;
      state.comments.unshift(action.payload);
    },
  },
});

export const {
  setThreadDetail,
  clearThreadDetail,
  toggleUpVoteThreadDetail,
  toggleDownVoteThreadDetail,
  toggleUpVoteComment,
  toggleDownVoteComment,
  addComment,
} = threadDetailSlice.actions;

// ─── Thunks ──────────────────────────────────────────────────────────────────

/**
 * Thunk: Ambil detail thread beserta komentar.
 */
export const asyncGetThreadDetail = (threadId) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const detail = await api.getThreadDetail(threadId);
    dispatch(setThreadDetail(detail));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Tambah komentar ke thread.
 */
export const asyncCreateComment = ({ threadId, content }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const comment = await api.createComment({ threadId, content });
    dispatch(addComment(comment));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Up-vote atau netralkan thread detail (optimistic).
 */
export const asyncToggleUpVoteThreadDetail = (threadId) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const isCurrentlyUpVoted = threadDetail?.upVotesBy.includes(userId);

  dispatch(toggleUpVoteThreadDetail({ userId }));

  try {
    if (isCurrentlyUpVoted) {
      await api.neutralVoteThread(threadId);
    } else {
      await api.upVoteThread(threadId);
    }
  } catch (error) {
    dispatch(toggleUpVoteThreadDetail({ userId }));
    toast.error(error.message);
  }
};

/**
 * Thunk: Down-vote atau netralkan thread detail (optimistic).
 */
export const asyncToggleDownVoteThreadDetail = (threadId) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const isCurrentlyDownVoted = threadDetail?.downVotesBy.includes(userId);

  dispatch(toggleDownVoteThreadDetail({ userId }));

  try {
    if (isCurrentlyDownVoted) {
      await api.neutralVoteThread(threadId);
    } else {
      await api.downVoteThread(threadId);
    }
  } catch (error) {
    dispatch(toggleDownVoteThreadDetail({ userId }));
    toast.error(error.message);
  }
};

/**
 * Thunk: Up-vote atau netralkan komentar (optimistic).
 */
export const asyncToggleUpVoteComment = (
  { threadId, commentId },
) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const comment = threadDetail?.comments.find((c) => c.id === commentId);
  const isCurrentlyUpVoted = comment?.upVotesBy.includes(userId);

  dispatch(toggleUpVoteComment({ commentId, userId }));

  try {
    if (isCurrentlyUpVoted) {
      await api.neutralVoteComment({ threadId, commentId });
    } else {
      await api.upVoteComment({ threadId, commentId });
    }
  } catch (error) {
    dispatch(toggleUpVoteComment({ commentId, userId }));
    toast.error(error.message);
  }
};

/**
 * Thunk: Down-vote atau netralkan komentar (optimistic).
 */
export const asyncToggleDownVoteComment = (
  { threadId, commentId },
) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const comment = threadDetail?.comments.find((c) => c.id === commentId);
  const isCurrentlyDownVoted = comment?.downVotesBy.includes(userId);

  dispatch(toggleDownVoteComment({ commentId, userId }));

  try {
    if (isCurrentlyDownVoted) {
      await api.neutralVoteComment({ threadId, commentId });
    } else {
      await api.downVoteComment({ threadId, commentId });
    }
  } catch (error) {
    dispatch(toggleDownVoteComment({ commentId, userId }));
    toast.error(error.message);
  }
};

export default threadDetailSlice.reducer;
