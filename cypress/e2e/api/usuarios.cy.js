/// <reference types="cypress" />

const { criarPayloadUsuario } = require('../../helpers/dataFactory');

describe('API | Usuários', () => {
  it('deve cadastrar usuário, consultar por ID e validar consistência dos dados', () => {
    const payload = criarPayloadUsuario();

    cy.apiRequest({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false })
      .then((createResponse) => {
        expect(createResponse.status).to.eq(201);
        expect(createResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
        expect(createResponse.body._id).to.be.a('string').and.not.be.empty;

        cy.apiRequest({ method: 'GET', url: `/usuarios/${createResponse.body._id}` })
          .then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.nome).to.eq(payload.nome);
            expect(getResponse.body.email).to.eq(payload.email);
            expect(getResponse.body.administrador).to.eq('false');
          });
      });
  });

  it('deve recusar cadastro com email já utilizado e retornar 400', () => {
    const payload = criarPayloadUsuario();

    // Cria o usuário base para garantir que o email existe antes do teste de duplicidade
    cy.apiRequest({ method: 'POST', url: '/usuarios', body: payload })
      .then((res) => {
        expect(res.status).to.eq(201);

        // Tenta criar novamente com o mesmo email
        cy.apiRequest({
          method: 'POST',
          url: '/usuarios',
          body: { ...payload, nome: 'Outro Nome' },
          failOnStatusCode: false,
        }).then((duplicateRes) => {
          expect(duplicateRes.status).to.eq(400);
          expect(duplicateRes.body).to.have.property('message', 'Este email já está sendo usado');
        });
      });
  });
});
