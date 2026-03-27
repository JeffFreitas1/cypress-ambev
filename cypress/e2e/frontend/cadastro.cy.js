/// <reference types="cypress" />

const { criarPayloadUsuario } = require('../../helpers/dataFactory');
const { criarUsuario } = require('../../helpers/userApi');

describe('Frontend | Cadastro de usuário', () => {
  it('deve registrar novo usuário cliente e redirecionar para a loja', () => {
    const payload = criarPayloadUsuario();

    cy.visit('/cadastrarusuarios');
    cy.get('[data-testid="nome"]').should('be.visible').type(payload.nome);
    cy.get('[data-testid="email"]').type(payload.email);
    cy.get('[data-testid="password"]').type(payload.password);
    cy.get('[data-testid="cadastrar"]').click();

    cy.url({ timeout: 20000 }).should('include', '/home');
    cy.get('[data-testid="pesquisar"]', { timeout: 15000 }).should('be.visible');
  });

  it('deve exibir erro ao tentar cadastrar com email já existente', () => {
    const payload = criarPayloadUsuario();

    criarUsuario(payload);

    cy.visit('/cadastrarusuarios');
    cy.get('[data-testid="nome"]').type('Usuário Duplicado');
    cy.get('[data-testid="email"]').type(payload.email);
    cy.get('[data-testid="password"]').type(payload.password);
    cy.get('[data-testid="cadastrar"]').click();

    cy.contains('Este email já está sendo usado', { timeout: 8000 }).should('be.visible');
  });
});
