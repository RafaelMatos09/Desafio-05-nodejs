const knex = require("../connection");

const listar = async (req, res) => {
  const categorias = await knex("categorias").debug();

  return res.json(categorias);
};

module.exports = {
  listar,
};
