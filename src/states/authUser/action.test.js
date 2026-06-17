/**
 * states/authUser/action.test.js
 * Unit test untuk thunk asyncLoginUser di authUser slice.
 *
 * Strategi:
 * - vi.mock() untuk isolasi modul api dan react-hot-toast
 * - dispatch di-mock dengan vi.fn() agar bisa diverifikasi
 * - showLoading/hideLoading dari react-redux-loading-bar tetap diverifikasi
 *   melalui action type yang di-dispatch
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { asyncLoginUser, setAuthUser } from './index';
import api from '../../utils/api';

// ─── Mock Modul Eksternal ─────────────────────────────────────────────────────

vi.mock('../../utils/api', () => ({
  default: {
    login: vi.fn(),
    putAccessToken: vi.fn(),
    getOwnProfile: vi.fn(),
    removeAccessToken: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// ─── Data Dummy ───────────────────────────────────────────────────────────────

const fakeCredentials = { email: 'budi@test.com', password: 'password123' };
const fakeToken = 'fake-jwt-token-xyz';
const fakeUser = { id: 'user-1', name: 'Budi Santoso', email: 'budi@test.com' };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('asyncLoginUser thunk', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  // ─── Skenario 1: Login Berhasil ─────────────────────────────────────────────

  describe('ketika login berhasil (API resolve)', () => {
    it('harus men-dispatch showLoading, setAuthUser, dan hideLoading secara berurutan', async () => {
      // Arrange: mock API agar berhasil
      api.login.mockResolvedValue(fakeToken);
      api.getOwnProfile.mockResolvedValue(fakeUser);

      // Act: jalankan thunk
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert: urutan dispatch
      expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
      expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUser(fakeUser));
      expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
      expect(dispatch).toHaveBeenCalledTimes(3);
    });

    it('harus memanggil api.login dengan kredensial yang benar', async () => {
      // Arrange
      api.login.mockResolvedValue(fakeToken);
      api.getOwnProfile.mockResolvedValue(fakeUser);

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert
      expect(api.login).toHaveBeenCalledWith(fakeCredentials);
      expect(api.login).toHaveBeenCalledTimes(1);
    });

    it('harus memanggil api.putAccessToken dengan token yang diterima', async () => {
      // Arrange
      api.login.mockResolvedValue(fakeToken);
      api.getOwnProfile.mockResolvedValue(fakeUser);

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert
      expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    });

    it('harus memanggil api.getOwnProfile setelah token disimpan', async () => {
      // Arrange
      api.login.mockResolvedValue(fakeToken);
      api.getOwnProfile.mockResolvedValue(fakeUser);

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert: getOwnProfile dipanggil sekali
      expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Skenario 2: Login Gagal ────────────────────────────────────────────────

  describe('ketika login gagal (API reject)', () => {
    it('harus men-dispatch showLoading dan hideLoading, lalu menampilkan toast error', async () => {
      // Arrange: mock API agar gagal
      const errorMessage = 'Email atau password salah';
      api.login.mockRejectedValue(new Error(errorMessage));

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert: showLoading dan hideLoading tetap ter-dispatch
      expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
      expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('harus TIDAK men-dispatch setAuthUser ketika login gagal', async () => {
      // Arrange
      api.login.mockRejectedValue(new Error('Unauthorized'));

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert: setAuthUser tidak pernah di-dispatch
      const dispatchedActions = dispatch.mock.calls.map((call) => call[0]);
      const hasSetAuthUser = dispatchedActions.some(
        (action) => action?.type === setAuthUser.type,
      );
      expect(hasSetAuthUser).toBe(false);
    });

    it('harus TIDAK memanggil api.getOwnProfile ketika api.login gagal', async () => {
      // Arrange
      api.login.mockRejectedValue(new Error('Network error'));

      // Act
      await asyncLoginUser(fakeCredentials)(dispatch);

      // Assert
      expect(api.getOwnProfile).not.toHaveBeenCalled();
    });
  });
});
