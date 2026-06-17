/**
 * cypress/e2e/login.cy.js
 * End-to-End test untuk alur Login — Forum Diskusi App.
 *
 * Mengapa ada cy.wait('@preloadCheck')?
 * App.jsx memanggil asyncPreloadProcess() saat mount, yang melakukan
 * GET /users/me untuk mengecek sesi login. Selama request ini berlangsung,
 * isPreload = true dan App me-return null (DOM kosong).
 * Cypress WAJIB menunggu preload selesai sebelum berinteraksi dengan DOM.
 *
 * Skenario yang diuji:
 * 1. Halaman login ditampilkan dengan elemen yang benar.
 * 2. Login gagal (kredensial salah) → toast error muncul, tetap di /login.
 * 3. Login berhasil (API di-intercept dengan mock) → redirect ke halaman beranda.
 */

describe('Login Page — Alur Autentikasi', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => win.sessionStorage.clear());

    // 1. Intercept preload GET /users/me SEBELUM cy.visit
    //    Kembalikan 401 agar asyncPreloadProcess selesai cepat
    //    dan menampilkan halaman login
    cy.intercept('GET', '**/users/me', {
      statusCode: 401,
      body: { status: 'fail', message: 'unauthenticated' },
    }).as('preloadCheck');

    cy.visit('/login');
    cy.wait('@preloadCheck');
  });

  // ─── Skenario 1: Render Halaman Login ──────────────────────────────────────

  it('harus menampilkan halaman login dengan elemen form yang lengkap', () => {
    // Heading
    cy.contains('h1', 'Masuk').should('be.visible');

    // Input email — id="login-email" sesuai LoginPage.jsx
    cy.get('#login-email')
      .should('be.visible')
      .should('have.attr', 'type', 'email');

    // Input password — id="login-password" sesuai LoginPage.jsx
    cy.get('#login-password')
      .should('be.visible')
      .should('have.attr', 'type', 'password');

    // Tombol submit
    cy.get('button[type="submit"]')
      .should('be.visible')
      .should('contain.text', 'Masuk');

    // Link ke halaman registrasi
    cy.contains('a', 'Daftar sekarang')
      .should('be.visible')
      .should('have.attr', 'href', '/register');
  });

  // ─── Skenario 2: Login Gagal (Kredensial Salah) ────────────────────────────

  it('harus menampilkan toast error dan tetap di halaman login jika kredensial salah', () => {
    // 2. Intercept spesifik untuk login gagal
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { status: 'fail', message: 'Email or password is wrong' },
    }).as('loginFail');

    // Isi form dengan kredensial salah
    cy.get('#login-email').type('salah@email.com');
    cy.get('#login-password').type('passwordSalah');
    cy.get('button[type="submit"]').click();

    // 3. Wajib tunggu respon gagal dari API palsu
    cy.wait('@loginFail');

    // 4. Toast error harus muncul
    cy.contains('Email or password is wrong', { timeout: 6000 }).should('be.visible');

    // 4. Pastikan tidak terpental ke beranda
    cy.url().should('include', '/login');
  });

  // ─── Skenario 3: Login Berhasil (Mock API Response) ────────────────────────

  it('harus me-redirect ke beranda setelah login berhasil dengan mock API', () => {
    const fakeToken = 'fake-jwt-token-cypress-e2e-test-2024';
    const fakeUser = {
      id: 'u-1',
      name: 'User',
      email: 'user@test.com',
      avatar: '',
    };

    // 5. Override intercept untuk login sukses
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', data: { token: fakeToken } },
    }).as('loginSuccess');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: { status: 'success', data: { user: fakeUser } },
    }).as('getMeSuccess');

    // Intercept GET /threads → agar HomePage tidak error
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { threads: [] } },
    }).as('getThreads');

    // Intercept GET /users → agar mapping user tidak error
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { users: [] } },
    }).as('getUsers');

    // Isi form dan submit
    cy.get('#login-email').type(fakeUser.email);
    cy.get('#login-password').type('passwordBenar');
    cy.get('button[type="submit"]').click();

    // 6. Tunggu API sukses dan pastikan URL pindah ke home
    cy.wait('@loginSuccess');
    cy.wait('@getMeSuccess');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);

    // Navigasi bar harus tampil sebagai bukti sudah di beranda
    cy.get('nav').should('be.visible');
  });
});
