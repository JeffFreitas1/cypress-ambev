/// <reference types="cypress" />

const { criarPayloadAdmin } = require('../../helpers/dataFactory');

describe('Frontend | Login', () => {
  let credenciais;

  before(() => {
    const payload = criarPayloadAdmin();
    credenciais = { email: payload.email, password: payload.password };

    cy.apiRequest({ method: 'POST', url: '/usuarios', body: payload })
      .then((res) => expect(res.status).to.eq(201));
  });

  it('deve autenticar administrador e redirecionar para o painel admin', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').should('be.visible').type(credenciais.email);
    cy.get('[data-testid="senha"]').should('be.visible').type(credenciais.password);
    cy.get('[data-testid="entrar"]').click();

    cy.url({ timeout: 20000 }).should('include', '/admin/home');
    cy.contains('Bem Vindo', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible');
    cy.get('[data-testid="listarUsuarios"]').should('be.visible');
  });

  it('deve exibir mensagem de erro com credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('naoexiste@qa.com');
    cy.get('[data-testid="senha"]').type('senhaerrada');
    cy.get('[data-testid="entrar"]').click();

    cy.url().should('include', '/login');
    cy.contains('Email e/ou senha inválidos', { timeout: 8000 }).should('be.visible');
  });
});
