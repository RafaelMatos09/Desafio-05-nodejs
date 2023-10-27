const knex = require("../connection");

const validaEmail = async (tabela, valor) => {
  let tipo = typeof valor === "string" ? "email" : "id";

  const usuario = await knex(tabela).where(tipo, valor).first();

  let name = tabela === "usuarios" ? "Usuario" : "Cliente";

  if (usuario) {
    return `${name} já cadastrado.`;
  }

  return false;
};

module.exports = {
  validaEmail,
};
