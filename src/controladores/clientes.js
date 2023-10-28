const knex = require("../connection");
const bcrypt = require("bcrypt");
const { validaCadastro } = require("../validacoes/usuario");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const emailExiste = await validaCadastro(
      "clientes",
      "email",
      email,
      "insert"
    );

    const cpfExiste = await validaCadastro("clientes", "cpf", cpf, "insert");

    if (emailExiste) {
      return res.status(404).json(emailExiste);
    }

    if (cpfExiste) {
      return res.status(404).json(cpfExiste);
    }

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

    return res.status(201).json(cliente[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json("Email ou cpf já existe!");
    }
    return res.status(500).json(error.message);
  }
};

const atualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const clienteExiste = await validaCadastro("clientes", "id", id, "update");

    if (clienteExiste) {
      return res.status(404).json(clienteExiste);
    }

    const cliente = await knex("clientes")
      .where({ id })
      .update({
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

    return res.status(201).json(cliente[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json("Email ou cpf já existe!");
    }
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarCliente,
  atualizarCliente,
};
