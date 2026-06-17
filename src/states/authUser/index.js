/**
 * states/authUser/index.js
 * Slice untuk menyimpan data user yang sedang login.
 * null = belum login | object = sudah login.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: null,
  reducers: {
    setAuthUser: (_state, action) => action.payload,
    clearAuthUser: () => null,
  },
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;

// ─── Thunks ──────────────────────────────────────────────────────────────────

/**
 * Thunk: Login pengguna.
 * Menyimpan token ke localStorage & mengambil profil user.
 */
export const asyncLoginUser = ({ email, password }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const token = await api.login({ email, password });
    api.putAccessToken(token);

    const authUser = await api.getOwnProfile();
    dispatch(setAuthUser(authUser));
    return true; // ← sukses: LoginPage boleh navigate ke '/'
  } catch (error) {
    toast.error(error.message);
    return false; // ← gagal: LoginPage tetap di /login
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Logout pengguna.
 * Menghapus token dari localStorage & membersihkan state.
 */
export const asyncLogoutUser = () => (dispatch) => {
  dispatch(clearAuthUser());
  api.removeAccessToken();
};

export default authUserSlice.reducer;
