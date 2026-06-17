/**
 * states/authUser/reducer.test.js
 * Unit test untuk authUser reducer.
 *
 * Reducer ini menggunakan Redux Toolkit createSlice, sehingga action type-nya
 * adalah 'authUser/setAuthUser' dan 'authUser/clearAuthUser'.
 */

import authUserReducer, { setAuthUser, clearAuthUser } from './index';

describe('authUserReducer', () => {
  // ─── Skenario 1: Initial State / Action Tidak Dikenal ───────────────────────

  describe('ketika menerima action yang tidak dikenal (unknown action)', () => {
    it('harus mengembalikan initial state null', () => {
      const initialState = undefined;
      const action = { type: 'UNKNOWN_ACTION' };

      const nextState = authUserReducer(initialState, action);

      expect(nextState).toBeNull();
    });

    it('harus mengembalikan state yang sama jika state sudah ada', () => {
      const existingUser = { id: 'user-1', name: 'Budi', email: 'budi@test.com' };
      const action = { type: 'UNKNOWN_ACTION' };

      const nextState = authUserReducer(existingUser, action);

      expect(nextState).toEqual(existingUser);
    });
  });

  // ─── Skenario 2: setAuthUser (user berhasil login) ──────────────────────────

  describe('ketika menerima action setAuthUser', () => {
    it('harus mengisi state dengan data user yang diberikan', () => {
      const initialState = null;
      const user = { id: 'user-123', name: 'Citra', email: 'citra@test.com' };

      const nextState = authUserReducer(initialState, setAuthUser(user));

      expect(nextState).toEqual(user);
    });

    it('harus menggantikan data user lama dengan user baru', () => {
      const oldUser = { id: 'user-1', name: 'Dani', email: 'dani@test.com' };
      const newUser = { id: 'user-2', name: 'Eka', email: 'eka@test.com' };

      const nextState = authUserReducer(oldUser, setAuthUser(newUser));

      expect(nextState).toEqual(newUser);
      expect(nextState.id).toBe('user-2');
    });
  });

  // ─── Skenario 3: clearAuthUser (user logout) ────────────────────────────────

  describe('ketika menerima action clearAuthUser', () => {
    it('harus mengosongkan state menjadi null ketika user logout', () => {
      const loggedInUser = { id: 'user-123', name: 'Citra', email: 'citra@test.com' };

      const nextState = authUserReducer(loggedInUser, clearAuthUser());

      expect(nextState).toBeNull();
    });

    it('harus tetap null jika state sudah null sebelumnya', () => {
      const nextState = authUserReducer(null, clearAuthUser());

      expect(nextState).toBeNull();
    });
  });
});
