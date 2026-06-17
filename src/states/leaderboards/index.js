/**
 * states/leaderboards/index.js
 * Slice untuk menyimpan data klasemen pengguna aktif.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: {
    setLeaderboards: (_state, action) => action.payload,
  },
});

export const { setLeaderboards } = leaderboardsSlice.actions;

// ─── Thunk ───────────────────────────────────────────────────────────────────

/**
 * Thunk: Ambil data leaderboard dari API.
 */
export const asyncGetLeaderboards = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const leaderboards = await api.getLeaderboards();
    dispatch(setLeaderboards(leaderboards));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

export default leaderboardsSlice.reducer;
