/**
 * api.js
 * Centralized helper untuk semua pemanggilan REST API ke Dicoding Forum API.
 * SEMUA pemanggilan fetch hanya boleh terjadi di sini.
 * Tidak boleh ada fetch langsung di komponen atau lifecycle.
 */

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

/** Ambil token dari localStorage */
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

/** Simpan token ke localStorage */
function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

/** Hapus token dari localStorage */
function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

/**
 * Wrapper fetch dengan header Authorization otomatis.
 * @param {string} url - Endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} - Data dari response JSON
 */
async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  const responseJSON = await response.json();

  if (responseJSON.status !== 'success') {
    throw new Error(responseJSON.message);
  }

  return responseJSON.data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Mendaftarkan pengguna baru.
 * @param {{ name: string, email: string, password: string }} param
 */
async function register({ name, email, password }) {
  const data = await fetchWithAuth(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return data.user;
}

/**
 * Login pengguna dan mendapatkan access token.
 * @param {{ email: string, password: string }} param
 */
async function login({ email, password }) {
  const data = await fetchWithAuth(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.token;
}

/**
 * Mendapatkan data pengguna yang sedang login berdasarkan token.
 */
async function getOwnProfile() {
  const data = await fetchWithAuth(`${BASE_URL}/users/me`);
  return data.user;
}

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * Mendapatkan semua pengguna terdaftar.
 */
async function getAllUsers() {
  const data = await fetchWithAuth(`${BASE_URL}/users`);
  return data.users;
}

// ─── Threads ─────────────────────────────────────────────────────────────────

/**
 * Mendapatkan semua thread (ringkasan).
 */
async function getAllThreads() {
  const data = await fetchWithAuth(`${BASE_URL}/threads`);
  return data.threads;
}

/**
 * Mendapatkan detail satu thread beserta komentar.
 * @param {string} threadId
 */
async function getThreadDetail(threadId) {
  const data = await fetchWithAuth(`${BASE_URL}/threads/${threadId}`);
  return data.detailThread;
}

/**
 * Membuat thread baru.
 * @param {{ title: string, body: string, category?: string }} param
 */
async function createThread({ title, body, category }) {
  const data = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  });
  return data.thread;
}

// ─── Comments ────────────────────────────────────────────────────────────────

/**
 * Menambahkan komentar ke thread.
 * @param {{ threadId: string, content: string }} param
 */
async function createComment({ threadId, content }) {
  const data = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return data.comment;
}

// ─── Votes ───────────────────────────────────────────────────────────────────

/**
 * Up-vote sebuah thread.
 * @param {string} threadId
 */
async function upVoteThread(threadId) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, { method: 'POST' });
}

/**
 * Down-vote sebuah thread.
 * @param {string} threadId
 */
async function downVoteThread(threadId) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, { method: 'POST' });
}

/**
 * Netralkan vote thread (batalkan up/down vote).
 * @param {string} threadId
 */
async function neutralVoteThread(threadId) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, { method: 'POST' });
}

/**
 * Up-vote sebuah komentar.
 * @param {{ threadId: string, commentId: string }} param
 */
async function upVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST' });
}

/**
 * Down-vote sebuah komentar.
 * @param {{ threadId: string, commentId: string }} param
 */
async function downVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST' });
}

/**
 * Netralkan vote komentar.
 * @param {{ threadId: string, commentId: string }} param
 */
async function neutralVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST' });
}

// ─── Leaderboards ────────────────────────────────────────────────────────────

/**
 * Mendapatkan data leaderboard.
 */
async function getLeaderboards() {
  const data = await fetchWithAuth(`${BASE_URL}/leaderboards`);
  return data.leaderboards;
}

// ─── Exports ─────────────────────────────────────────────────────────────────

const api = {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
  getLeaderboards,
};

export default api;
