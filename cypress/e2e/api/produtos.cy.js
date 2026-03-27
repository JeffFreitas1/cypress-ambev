/// <reference types="cypress" />

describe('API | Produtos', () => {
  it('deve listar produtos com estrutura e campos esperados', () => {
    cy.apiRequest({ method: 'GET', url: '/produtos' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade').and.to.be.a('number');
      expect(response.body.produtos).to.be.an('array').and.not.be.empty;

      const produto = response.body.produtos[0];
      expect(produto).to.include.keys('_id', 'nome', 'preco', 'descricao', 'quantidade');
      expect(produto.nome).to.be.a('string').and.not.be.empty;
      expect(produto.preco).to.be.a('number').and.to.be.greaterThan(0);
    });
  });

  it('deve buscar produto por ID e retornar os mesmos dados da listagem', () => {
    cy.apiRequest({ method: 'GET', url: '/produtos' }).then((listResponse) => {
      const produto = listResponse.body.produtos[0];

      cy.apiRequest({ method: 'GET', url: `/produtos/${produto._id}` }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body._id).to.eq(produto._id);
        expect(getResponse.body.nome).to.eq(produto.nome);
        expect(getResponse.body.preco).to.eq(produto.preco);
      });
    });
  });
});
