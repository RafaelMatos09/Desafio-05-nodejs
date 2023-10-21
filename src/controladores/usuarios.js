const knex = require("../connection");
const bcrypt = require("bcrypt");

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning(["nome", "email"]);
    return res.status(201).json(usuario);
  } catch (error) {
    if (error.code == "23505")
      return res.status(400).json({ mensagem: "Email já existe!" });
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const listarUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {
    const usuario = await knex("usuarios").where({ id }).returning("*");

    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, senha } = req.body;

  try {
    senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .where({ id })
      .update({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning("*");

    return res.status(201).json(usuario[0]);
  } catch (error) {
    if (error.code == "23505")
      return res.status(400).json({ mensagem: "Email já existe!" });
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

module.exports = {
  cadastrar,
  listarUsuario,
  atualizarUsuario,
};
