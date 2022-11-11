const { defineConfig } = require('cypress');

module.exports = defineConfig({
  "projectId": "139hik",
  "blockHosts": "www.google-analytics.com",
  "video": false,
  "defaultCommandTimeout": 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    "specPattern": "cypress/e2e/**/*.{js,jsx,ts,tsx}"
  }
});