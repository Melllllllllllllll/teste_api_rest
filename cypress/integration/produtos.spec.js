/// <reference types="cypress" />

describe("Testes de funcionalidade Produtos", () => {
  let token;
  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Listar Produtos", () => {
    cy.request({
      method: "GET",
      url: "produtos",
    }).then((response) => {
      expect(response.body.produtos[0].nome).to.equal("produto 4644761");
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("produtos");
      expect(response.duration).to.be.lessThan(266);
    });
  });

  it("Cadastrar Produtos", () => {
    let produto = `produto ${Math.floor(Math.random() * 5000000)}`;

    cy.request({
      method: "POST",
      url: "produtos",
      body: {
        nome: produto,
        preco: 300,
        descricao: "Mouse gamer",
        quantidade: 100,
      },
      headers: { authorization: token },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar mensagem de erro ao cadastrar produto repetido", () => {
    cy.cadastrarProduto(
      token,
      "produto 4644761",
      300,
      "descrição do mouse gamer",
      100
    ).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Já existe produto com esse nome");
    });
  });
});
