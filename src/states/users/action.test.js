/**
 * states/users/action.test.js
 * Unit test untuk thunk asyncRegisterUser di users slice.
 *
 * Strategi:
 * - vi.mock() untuk isolasi modul api dan react-hot-toast
 * - dispatch di-mock dengan vi.fn() agar bisa diverifikasi
 * - asyncRegisterUser mengembalikan boolean: true (sukses) / false (gagal)
 */

import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import toast from 'react-hot-toast';
import { asyncRegisterUser } from './index';
import api from '../../utils/api';

// ─── Mock Modul Eksternal ─────────────────────────────────────────────────────

vi.mock('../../utils/api', () => ({
  default: {
    register: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// ─── Data Dummy ───────────────────────────────────────────────────────────────

const fakeUserData = {
  name: 'Citra Dewi',
  email: 'citra@test.com',
  password: 'securePass123',
};

const fakeRegisteredUser = {
  id: 'user-new-1',
  name: 'Citra Dewi',
  email: 'citra@test.com',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('asyncRegisterUser thunk', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  // ─── Skenario 1: Registrasi Berhasil ────────────────────────────────────────

  describe('ketika registrasi berhasil (API resolve)', () => {
    it('harus men-dispatch showLoading dan hideLoading secara berurutan', async () => {
      // Arrange: mock API berhasil
      api.register.mockResolvedValue(fakeRegisteredUser);

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert: urutan dispatch
      expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
      expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('harus memanggil api.register dengan data user yang benar', async () => {
      // Arrange
      api.register.mockResolvedValue(fakeRegisteredUser);

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(api.register).toHaveBeenCalledWith(fakeUserData);
      expect(api.register).toHaveBeenCalledTimes(1);
    });

    it('harus mengembalikan true ketika registrasi berhasil', async () => {
      // Arrange
      api.register.mockResolvedValue(fakeRegisteredUser);

      // Act
      const result = await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(result).toBe(true);
    });

    it('harus TIDAK memanggil toast.error ketika berhasil', async () => {
      // Arrange
      api.register.mockResolvedValue(fakeRegisteredUser);

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  // ─── Skenario 2: Registrasi Gagal ───────────────────────────────────────────

  describe('ketika registrasi gagal (API reject)', () => {
    it('harus men-dispatch showLoading dan hideLoading meskipun API gagal', async () => {
      // Arrange: mock API agar gagal
      api.register.mockRejectedValue(new Error('Email sudah terdaftar'));

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
      expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('harus mengembalikan false ketika registrasi gagal', async () => {
      // Arrange
      api.register.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(result).toBe(false);
    });

    it('harus memanggil toast.error dengan pesan error yang diterima', async () => {
      // Arrange
      const errorMessage = 'Email sudah terdaftar';
      api.register.mockRejectedValue(new Error(errorMessage));

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('harus memanggil api.register dengan data yang sama meski nantinya gagal', async () => {
      // Arrange
      api.register.mockRejectedValue(new Error('Server error'));

      // Act
      await asyncRegisterUser(fakeUserData)(dispatch);

      // Assert: API tetap dipanggil dengan argumen yang benar
      expect(api.register).toHaveBeenCalledWith(fakeUserData);
    });
  });
});
