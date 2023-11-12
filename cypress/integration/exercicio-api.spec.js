/// <reference types="cypress" />
import contrato from "../contracts/usuarios.contract";
let id = ""
let math = Math.floor(Math.random() * 5000000)

describe("Testes da Funcionalidade Usuários", () => {
  it("Deve validar contrato de usuários", () => {
    cy.request("usuarios").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    let email = `emai${math}@email.com`;
    cy.request({
      method: "POST",
      url: "usuarios",
      body: {
        nome: "Morenaaa oliveira",
        email: email,
        password: "morena23654",
        administrador: "true",
      },
      failOnStatusCode: false,
    }).then((response) => {
         id = response.body._id
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.request({
      method: "POST",
      url: "usuarios",
      body: {
        nome: "Maria da silva oliveira",
        email: "morena2@qa.com.br",
        password: "morena23654",
        administrador: "true",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Este email já está sendo usado");
    });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    cy.request({
      method: "PUT",
      url: `usuarios/${id}`,
      body: {
        nome: `Ana da Silva ${math}`,
        email: "ana@qa.com.br",
        password: "teste234678",
        administrador: "true",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Registro alterado com sucesso");
    });
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    cy.request({
      method: "DELETE",
      url: `usuarios/${id}`
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Registro excluído com sucesso");
    });
  });
});
