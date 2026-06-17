/**
 * states/isPreload/reducer.test.js
 * Unit test untuk isPreload reducer.
 *
 * Reducer ini menggunakan Redux Toolkit createSlice dengan:
 * - initialState: true  (preloading sedang berlangsung)
 * - action setIsPreload: menetapkan nilai boolean baru
 */

import isPreloadReducer, { setIsPreload } from './index';

describe('isPreloadReducer', () => {
  // ─── Skenario 1: Initial State / Action Tidak Dikenal ───────────────────────

  describe('ketika menerima action yang tidak dikenal (unknown action)', () => {
    it('harus mengembalikan initial state true', () => {
      const initialState = undefined;
      const action = { type: 'UNKNOWN_ACTION' };

      const nextState = isPreloadReducer(initialState, action);

      expect(nextState).toBe(true);
    });

    it('harus mengembalikan state yang sama jika sudah false', () => {
      const currentState = false;
      const action = { type: 'UNKNOWN_ACTION' };

      const nextState = isPreloadReducer(currentState, action);

      expect(nextState).toBe(false);
    });
  });

  // ─── Skenario 2: setIsPreload(false) — preload selesai ──────────────────────

  describe('ketika menerima action setIsPreload dengan nilai false', () => {
    it('harus mengubah state menjadi false setelah proses preload selesai', () => {
      const initialState = true;

      const nextState = isPreloadReducer(initialState, setIsPreload(false));

      expect(nextState).toBe(false);
    });

    it('harus tetap false jika state sudah false sebelumnya', () => {
      const nextState = isPreloadReducer(false, setIsPreload(false));

      expect(nextState).toBe(false);
    });
  });

  // ─── Skenario 3: setIsPreload(true) — reset ke mode preloading ──────────────

  describe('ketika menerima action setIsPreload dengan nilai true', () => {
    it('harus mengubah state menjadi true (kembali ke mode preloading)', () => {
      const currentState = false;

      const nextState = isPreloadReducer(currentState, setIsPreload(true));

      expect(nextState).toBe(true);
    });

    it('harus tetap true jika state sudah true sebelumnya', () => {
      const nextState = isPreloadReducer(true, setIsPreload(true));

      expect(nextState).toBe(true);
    });
  });
});
