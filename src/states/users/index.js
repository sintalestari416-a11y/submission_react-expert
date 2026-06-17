/**
 * states/users/index.js
 * Slice untuk menyimpan daftar semua pengguna terdaftar.
 * Digunakan untuk mapping nama & avatar pada thread dan komentar.
 */

import { createSlice } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (_state, action) => action.payload,
  },
});

export const { setUsers } = usersSlice.actions;

// ─── Thunk ───────────────────────────────────────────────────────────────────

/**
 * Thunk: Mengambil semua data pengguna dari API.
 */
export const asyncGetAllUsers = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const users = await api.getAllUsers();
    dispatch(setUsers(users));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Thunk: Mendaftarkan pengguna baru ke API.
 * Dipanggil dari RegisterPage via dispatch.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<boolean>} true jika berhasil, false jika gagal.
 */
export const asyncRegisterUser = ({ name, email, password }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    await api.register({ name, email, password });
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  } finally {
    dispatch(hideLoading());
  }
};

export default usersSlice.reducer;
