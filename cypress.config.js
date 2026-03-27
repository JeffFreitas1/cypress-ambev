const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      apiBaseUrl: 'https://serverest.dev',
    },
    setupNodeEvents() {},
  },
});
