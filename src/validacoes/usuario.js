const knex = require("../connection");

const validaCadastro = async (tabela, tipo, valor, verbo) => {
  const usuario = await knex(tabela).where(tipo, valor).returning("*").debug();

  let name = tabela === "usuarios" ? "Usuario" : "Cliente";
  if (verbo === "insert") {
    if (usuario[0]) {
      return `${name} já cadastrado.`;
    }
  } else if (verbo === "update") {
    if (!usuario[0]) {
      return `${name} não encontrado`;
    }
  }

  return false;
};

module.exports = {
  validaCadastro,
};
