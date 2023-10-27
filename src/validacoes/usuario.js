const knex = require("../connection");

const validaCadastro = async (tabela, tipo, valor, verbo) => {
  const usuario = await knex(tabela).where(tipo, valor).first();

  let name = tabela === "usuarios" ? "Usuario" : "Cliente";
  if (verbo === "insert") {
    if (usuario) {
      return `${name} já cadastrado.`;
    }
  } else if (verbo === "update") {
    if (!usuario) {
      return `${name} não encontrado`;
    }
  }
  return false;
};

module.exports = {
  validaCadastro,
};
