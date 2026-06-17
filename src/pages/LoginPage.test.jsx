/**
 * pages/LoginPage.test.jsx
 * Unit test untuk komponen LoginPage.
 *
 * Komponen ini bergantung pada:
 * - useDispatch (memanggil asyncLoginUser)
 * - useSelector (mengecek authUser untuk redirect)
 * - useNavigate (redirect setelah login)
 * - <Link> (navigasi ke /register)
 *
 * Strategi:
 * - Mock react-redux (useDispatch, useSelector)
 * - Mock react-router-dom (useNavigate)
 * - Bungkus dengan MemoryRouter agar <Link> berfungsi
 * - useSelector mengembalikan null (user belum login) agar halaman ter-render
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import LoginPage from './LoginPage';

// ─── Mock react-redux ─────────────────────────────────────────────────────────

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

// ─── Mock useNavigate dari react-router-dom ───────────────────────────────────

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ─── Mock thunk asyncLoginUser ────────────────────────────────────────────────

vi.mock('../states/authUser', () => ({
  asyncLoginUser: vi.fn(({ email, password }) => ({
    type: 'authUser/asyncLoginUser',
    payload: { email, password },
  })),
}));

// ─── Helper render ────────────────────────────────────────────────────────────

function renderLoginPage(authUser = null) {
  const mockDispatch = vi.fn().mockResolvedValue(undefined);
  reactRedux.useDispatch.mockReturnValue(mockDispatch);
  // useSelector digunakan untuk mengecek authUser (untuk guard redirect)
  reactRedux.useSelector.mockReturnValue(authUser);

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );

  return { mockDispatch };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LoginPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Skenario 1: Render Elemen Dasar ──────────────────────────────────────

  describe('ketika halaman di-render (user belum login)', () => {
    it('harus menampilkan judul Masuk', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /masuk/i })).toBeInTheDocument();
    });

    it('harus menampilkan input email dan input password', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('harus menampilkan tombol submit Masuk', () => {
      renderLoginPage();

      expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
    });

    it('harus menampilkan link ke halaman registrasi', () => {
      renderLoginPage();

      const registerLink = screen.getByRole('link', { name: /daftar sekarang/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  // ─── Skenario 2: Interaksi Mengetik ───────────────────────────────────────

  describe('ketika user berinteraksi dengan form', () => {
    it('harus memperbarui nilai input email ketika user mengetik', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'budi@test.com');

      expect(emailInput).toHaveValue('budi@test.com');
    });

    it('harus memperbarui nilai input password ketika user mengetik', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'secretPassword123');

      expect(passwordInput).toHaveValue('secretPassword123');
    });

    it('harus memperbarui kedua input secara independen', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'citra@test.com');
      await user.type(passwordInput, 'mypassword');

      expect(emailInput).toHaveValue('citra@test.com');
      expect(passwordInput).toHaveValue('mypassword');
    });
  });

  // ─── Skenario 3: Submit Form & Dispatch ───────────────────────────────────

  describe('ketika form disubmit', () => {
    it('harus memanggil dispatch ketika tombol Masuk diklik', async () => {
      const user = userEvent.setup();
      const { mockDispatch } = renderLoginPage();

      // Isi form
      await user.type(screen.getByLabelText(/email/i), 'budi@test.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      // Submit
      await user.click(screen.getByRole('button', { name: /masuk/i }));

      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('harus memanggil dispatch dengan asyncLoginUser berisi email dan password yang diketik', async () => {
      const user = userEvent.setup();
      const { mockDispatch } = renderLoginPage();

      const testEmail = 'budi@test.com';
      const testPassword = 'password123';

      await user.type(screen.getByLabelText(/email/i), testEmail);
      await user.type(screen.getByLabelText(/password/i), testPassword);
      await user.click(screen.getByRole('button', { name: /masuk/i }));

      // Verifikasi argumen dispatch: action type dari asyncLoginUser
      const dispatchedArg = mockDispatch.mock.calls[0][0];
      expect(dispatchedArg).toMatchObject({
        type: 'authUser/asyncLoginUser',
        payload: { email: testEmail, password: testPassword },
      });
    });

    it('harus memanggil navigate ke "/" setelah dispatch berhasil', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/email/i), 'eka@test.com');
      await user.type(screen.getByLabelText(/password/i), 'pass456');
      await user.click(screen.getByRole('button', { name: /masuk/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  // ─── Skenario 4: Guard redirect jika sudah login ──────────────────────────

  describe('ketika user sudah login (authUser terisi)', () => {
    it('harus memanggil navigate ke "/" dan tidak merender form', () => {
      const loggedInUser = { id: 'user-1', name: 'Budi' };
      renderLoginPage(loggedInUser);

      // Form tidak dirender karena komponen langsung return null
      expect(screen.queryByRole('button', { name: /masuk/i })).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
