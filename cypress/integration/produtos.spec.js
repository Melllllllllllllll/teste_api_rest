/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'

describe("Testes de funcionalidade Produtos", () => {
  let token;
  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

    it('Deve validar contrato de produtos', () => {
      cy.request('produtos').then(response => {
           return contrato.validateAsync(response.body)
      
      })
    
  });

  it("Listar Produtos", () => {
    cy.request({
      method: "GET",
      url: "produtos",
    }).then((response) => {
      expect(response.body.produtos[0].nome).to.equal("Produto 45642083");
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

  it('Deve editar um produto já cadastrado', () => {
    cy.request('produtos').then(response => {
      let id = response.body.produtos[0]._id;
      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          "nome": "Produto 45642083",
          "preco": 250,
          "descricao": "Produto editado",
          "quantidade": 300
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });
    });
  });

  it('Deve editar um produto cadastrado previamente', () => {
    let produto = `produto ${Math.floor(Math.random() * 5000000)}`;
    cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180).then(response => {
      let id = response.body._id;
      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          "nome": produto,
          "preco": 200,
          "descricao": "Produto editado",
          "quantidade": 150
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });
    });
  });

  it('Deve deletar um produto previamente cadastrado', () => {
    let produto = `produto ${Math.floor(Math.random() * 5000000)}`;
    cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180).then(response => {
      let id = response.body._id;
      cy.request({
        method: 'DELETE',
        url: `produtos/${id}`,
        headers: { authorization: token }
      }).then(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso');
        expect(response.status).to.equal(200);
      });
    });
  });
});
