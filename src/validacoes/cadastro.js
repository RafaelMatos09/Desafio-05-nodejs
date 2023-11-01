const knex = require("../connection");

const validaCadastro = async (tabela, tipo, valor, verbo) => {
  const cadastro = await knex(tabela).where(tipo, valor).returning("*").debug();

  const tabelaNomes = {
    usuarios: "Usuario",
    clientes: "Cliente",
    produtos: "Produto",
    categorias: "Categoria",
  };

  let name = tabelaNomes[tabela] || "Desconhecido";

  if (verbo === "insert") {
    if (tabela === "categorias") {
      if (cadastro[0]) {
        return false;
      } else {
        return `${name} ${tipo} não encontrado`;
      }
    } else if (cadastro[0]) {
      return `${name} ${tipo} já cadastrado.`;
    }
  } else if (verbo === "update" || verbo === "delete" || verbo === "select") {
    if (!cadastro[0]) {
      return `${name} ${tipo} não encontrado`;
    }
  }

  return false;
};

module.exports = {
  validaCadastro,
};
