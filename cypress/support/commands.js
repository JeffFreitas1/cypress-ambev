const API_BASE = Cypress.env('apiBaseUrl');

/**
 * Requisição à API ServeRest com URL base automática.
 * Permite passar apenas o path (ex.: '/login') ou uma URL completa.
 * @param {Cypress.RequestOptions} options
 */
Cypress.Commands.add('apiRequest', (options) => {
  const url = options.url.startsWith('http')
    ? options.url
    : `${API_BASE}${options.url}`;

  return cy.request({ failOnStatusCode: true, ...options, url });
});
