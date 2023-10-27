const knex = require("../connection");
const bcrypt = require("bcrypt");
const { validaEmail } = require("../validacoes/usuario");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const emailExiste = await validaEmail("clientes", email);

    if (emailExiste) return res.status(404).json(emailExiste);

    const cliente = await knex("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning("*");

    return res.status(201).json(cliente);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarCliente,
};
