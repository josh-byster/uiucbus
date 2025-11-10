import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '139hik',
  blockHosts: 'www.google-analytics.com',
  video: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
