/**
 * states/threads/index.js
 * Slice untuk daftar thread (ringkasan) beserta fitur vote optimis.
 *
 * Pendekatan "Optimistic Action":
 * 1. Update state lokal terlebih dahulu.
 * 2. Panggil API di background.
 * 3. Jika API gagal, kembalikan state ke semula + tampilkan alert.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    setThreads: (_state, action) => action.payload,

    /** Optimistic: tambah/hapus userId dari upVotesBy thread */
    toggleUpVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.find((t) => t.id === threadId);
      if (!thread) return;

      const upIndex = thread.upVotesBy.indexOf(userId);
      const downIndex = thread.downVotesBy.indexOf(userId);

      if (upIndex !== -1) {
        // Sudah up-vote → netralkan
        thread.upVotesBy.splice(upIndex, 1);
      } else {
        // Belum up-vote → tambahkan & hapus dari down jika ada
        thread.upVotesBy.push(userId);
        if (downIndex !== -1) thread.downVotesBy.splice(downIndex, 1);
      }
    },

    /** Optimistic: tambah/hapus userId dari downVotesBy thread */
    toggleDownVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.find((t) => t.id === threadId);
      if (!thread) return;

      const downIndex = thread.downVotesBy.indexOf(userId);
      const upIndex = thread.upVotesBy.indexOf(userId);

      if (downIndex !== -1) {
        thread.downVotesBy.splice(downIndex, 1);
      } else {
        thread.downVotesBy.push(userId);
        if (upIndex !== -1) thread.upVotesBy.splice(upIndex, 1);
      }
    },
  },
});

export const { setThreads, toggleUpVoteThread, toggleDownVoteThread } = threadsSlice.actions;

// ─── Thunks ──────────────────────────────────────────────────────────────────

/**
 * Thunk: Ambil semua thread dari API.
 */
export const asyncGetAllThreads = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const threads = await api.getAllThreads();
    dispatch(setThreads(threads));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Buat thread baru.
 */
export const asyncCreateThread = ({ title, body, category }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const newThread = await api.createThread({ title, body, category });
    dispatch(setThreads([])); // Akan di-refresh dari halaman Home
    return newThread;
  } catch (error) {
    toast.error(error.message);
    return null;
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Up-vote atau netralkan thread (optimistic).
 */
export const asyncToggleUpVoteThread = (threadId) => async (dispatch, getState) => {
  const { authUser } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const thread = getState().threads.find((t) => t.id === threadId);
  const isCurrentlyUpVoted = thread?.upVotesBy.includes(userId);

  // 1. Optimistic update
  dispatch(toggleUpVoteThread({ threadId, userId }));

  try {
    // 2. Panggil API
    if (isCurrentlyUpVoted) {
      await api.neutralVoteThread(threadId);
    } else {
      await api.upVoteThread(threadId);
    }
  } catch (error) {
    // 3. Rollback jika gagal
    dispatch(toggleUpVoteThread({ threadId, userId }));
    toast.error(error.message);
  }
};

/**
 * Thunk: Down-vote atau netralkan thread (optimistic).
 */
export const asyncToggleDownVoteThread = (threadId) => async (dispatch, getState) => {
  const { authUser } = getState();
  if (!authUser) {
    toast.error('Anda harus login untuk melakukan vote.');
    return;
  }

  const { id: userId } = authUser;
  const thread = getState().threads.find((t) => t.id === threadId);
  const isCurrentlyDownVoted = thread?.downVotesBy.includes(userId);

  // 1. Optimistic update
  dispatch(toggleDownVoteThread({ threadId, userId }));

  try {
    // 2. Panggil API
    if (isCurrentlyDownVoted) {
      await api.neutralVoteThread(threadId);
    } else {
      await api.downVoteThread(threadId);
    }
  } catch (error) {
    // 3. Rollback jika gagal
    dispatch(toggleDownVoteThread({ threadId, userId }));
    toast.error(error.message);
  }
};

export default threadsSlice.reducer;
