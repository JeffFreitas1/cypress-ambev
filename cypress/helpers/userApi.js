/**
 * Ações de API relacionadas a usuários.
 * Usa cy.apiRequest (definido em commands.js) para interagir com o ServeRest.
 */

/**
 * Cria um usuário via API e retorna o _id gerado.
 * @param {object} payload - corpo da requisição POST /usuarios
 */
const criarUsuario = (payload) =>
  cy.apiRequest({ method: 'POST', url: '/usuarios', body: payload }).then((res) => {
    expect(res.status).to.eq(201);
    return res.body._id;
  });

/**
 * Realiza login via API e retorna o token Bearer.
 * @param {{ email: string, password: string }} credenciais
 */
const loginApi = (credenciais) =>
  cy
    .apiRequest({ method: 'POST', url: '/login', body: credenciais, failOnStatusCode: false })
    .then((res) => {
      expect(res.status).to.eq(200);
      const { authorization } = res.body;
      return authorization.startsWith('Bearer ') ? authorization : `Bearer ${authorization}`;
    });

module.exports = { criarUsuario, loginApi };
