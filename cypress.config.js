import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    setupNodeEvents(on, config) {
      // Tambahkan plugin Cypress di sini jika diperlukan
      return config;
    },
  },
});
