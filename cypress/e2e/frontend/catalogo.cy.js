/// <reference types="cypress" />

const { criarPayloadUsuario } = require('../../helpers/dataFactory');
const { criarUsuario } = require('../../helpers/userApi');

describe('Frontend | Catálogo de produtos', () => {
  let credenciais;

  before(() => {
    const payload = criarPayloadUsuario({ nome: 'Usuário Catálogo' });
    credenciais = { email: payload.email, password: payload.password };

    criarUsuario(payload);
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(credenciais.email);
    cy.get('[data-testid="senha"]').type(credenciais.password);
    cy.get('[data-testid="entrar"]').click();
    cy.url({ timeout: 20000 }).should('include', '/home');
  });

  it('deve exibir campo de busca e cards de produtos após login de cliente', () => {
    cy.get('[data-testid="pesquisar"]', { timeout: 15000 }).should('be.visible');
    cy.get('[data-testid="product-detail-link"]', { timeout: 20000 })
      .should('have.length.at.least', 1)
      .first()
      .should('be.visible');
  });

  it('deve filtrar produtos pelo campo de busca', () => {
    cy.get('[data-testid="pesquisar"]', { timeout: 15000 }).type('Produto');
    cy.get('[data-testid="product-detail-link"]', { timeout: 10000 }).should('exist');
  });
});
