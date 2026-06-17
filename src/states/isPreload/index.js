/**
 * states/isPreload/index.js
 * Slice untuk status pengecekan sesi awal (preloading).
 * Digunakan agar splash/loading ditampilkan saat app pertama kali dimuat.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { setAuthUser } from '../authUser';

const isPreloadSlice = createSlice({
  name: 'isPreload',
  initialState: true,
  reducers: {
    setIsPreload: (_state, action) => action.payload,
  },
});

export const { setIsPreload } = isPreloadSlice.actions;

// ─── Thunk ───────────────────────────────────────────────────────────────────

/**
 * Thunk: Cek session login awal saat aplikasi dimuat.
 * Jika token ada dan valid, set authUser; jika tidak, biarkan null.
 */
export const asyncPreloadProcess = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const authUser = await api.getOwnProfile();
    dispatch(setAuthUser(authUser));
  } catch {
    dispatch(setAuthUser(null));
  } finally {
    dispatch(setIsPreload(false));
    dispatch(hideLoading());
  }
};

export default isPreloadSlice.reducer;
