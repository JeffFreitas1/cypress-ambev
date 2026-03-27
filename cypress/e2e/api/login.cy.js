/// <reference types="cypress" />

const { criarPayloadUsuario } = require('../../helpers/dataFactory');

describe('API | Login', () => {
  let credenciais;

  before(() => {
    const payload = criarPayloadUsuario();
    credenciais = { email: payload.email, password: payload.password };

    cy.apiRequest({ method: 'POST', url: '/usuarios', body: payload })
      .then((res) => expect(res.status).to.eq(201));
  });

  it('deve autenticar com credenciais válidas e retornar token Bearer', () => {
    cy.apiRequest({ method: 'POST', url: '/login', body: credenciais })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Login realizado com sucesso');
        expect(response.body.authorization).to.be.a('string').and.match(/^Bearer\s.+/);
      });
  });

  it('deve recusar login com credenciais inválidas e retornar 401', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/login',
      body: { email: 'naoexiste@qa.com', password: 'senhaerrada' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('message', 'Email e/ou senha inválidos');
    });
  });
});
