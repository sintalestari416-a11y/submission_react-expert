/**
 * components/CommentInput.test.jsx
 * Unit test untuk komponen CommentInput.
 *
 * Komponen ini memiliki 2 render state:
 * 1. authUser = null  → tampilkan prompt login (link ke /login)
 * 2. authUser = object → tampilkan form textarea + tombol kirim
 *
 * Strategi:
 * - Mock useDispatch dan useSelector dari react-redux
 * - Bungkus dengan MemoryRouter karena komponen menggunakan <Link>
 * - Gunakan userEvent untuk simulasi interaksi nyata
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import CommentInput from './CommentInput';

// ─── Mock react-redux ─────────────────────────────────────────────────────────

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

// ─── Mock thunk asyncCreateComment ───────────────────────────────────────────

vi.mock('../states/threadDetail', () => ({
  asyncCreateComment: vi.fn(({ threadId, content }) => ({
    type: 'threadDetail/asyncCreateComment',
    payload: { threadId, content },
  })),
}));

// ─── Data dummy ───────────────────────────────────────────────────────────────

const fakeAuthUser = { id: 'user-1', name: 'Budi Santoso' };
const fakeThreadId = 'thread-abc-123';

// ─── Helper render ────────────────────────────────────────────────────────────

function renderCommentInput(authUser = fakeAuthUser) {
  const mockDispatch = vi.fn();
  reactRedux.useDispatch.mockReturnValue(mockDispatch);
  reactRedux.useSelector.mockReturnValue(authUser);

  render(
    <MemoryRouter>
      <CommentInput threadId={fakeThreadId} />
    </MemoryRouter>,
  );

  return { mockDispatch };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CommentInput component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Skenario 1: Render saat user belum login ──────────────────────────────

  describe('ketika user belum login (authUser = null)', () => {
    it('harus menampilkan prompt login, bukan form textarea', () => {
      renderCommentInput(null);

      // Form tidak ada
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /kirim/i })).not.toBeInTheDocument();

      // Prompt login tampil
      expect(screen.getByText(/untuk menambahkan komentar/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });
  });

  // ─── Skenario 2: Render saat user sudah login ──────────────────────────────

  describe('ketika user sudah login (authUser terisi)', () => {
    it('harus menampilkan textarea dan tombol Kirim Komentar', () => {
      renderCommentInput();

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /kirim komentar/i })).toBeInTheDocument();
      expect(screen.getByText('Tambah Komentar')).toBeInTheDocument();
    });

    it('tombol Kirim Komentar harus disabled ketika textarea masih kosong', () => {
      renderCommentInput();

      const button = screen.getByRole('button', { name: /kirim komentar/i });
      expect(button).toBeDisabled();
    });

    // ─── Skenario 3: Interaksi mengetik ────────────────────────────────────

    it('harus memperbarui nilai textarea ketika user mengetik', async () => {
      const user = userEvent.setup();
      renderCommentInput();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Komentar pengujian yang menarik');

      expect(textarea).toHaveValue('Komentar pengujian yang menarik');
    });

    it('tombol Kirim harus aktif (enabled) setelah user mengetik konten', async () => {
      const user = userEvent.setup();
      renderCommentInput();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Isi komentar');

      const button = screen.getByRole('button', { name: /kirim komentar/i });
      expect(button).toBeEnabled();
    });

    // ─── Skenario 4: Submit form ────────────────────────────────────────────

    it('harus memanggil dispatch dengan asyncCreateComment ketika form disubmit', async () => {
      const user = userEvent.setup();
      const { mockDispatch } = renderCommentInput();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Komentar untuk pengujian');

      const button = screen.getByRole('button', { name: /kirim komentar/i });
      await user.click(button);

      // dispatch harus dipanggil
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('harus mengosongkan textarea setelah form berhasil disubmit', async () => {
      const user = userEvent.setup();
      renderCommentInput();

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Komentar yang akan dikirim');
      await user.click(screen.getByRole('button', { name: /kirim komentar/i }));

      // Textarea harus kembali kosong setelah submit
      expect(textarea).toHaveValue('');
    });

    it('harus TIDAK memanggil dispatch jika textarea hanya berisi spasi', async () => {
      const user = userEvent.setup();
      const { mockDispatch } = renderCommentInput();

      const textarea = screen.getByRole('textbox');
      // Ketik spasi saja — konten trim() akan menghasilkan string kosong
      await user.type(textarea, '   ');

      // Coba submit via keyboard Enter pada form — tombol masih disabled
      const button = screen.getByRole('button', { name: /kirim komentar/i });
      expect(button).toBeDisabled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
