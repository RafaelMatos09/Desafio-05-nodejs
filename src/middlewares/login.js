const knex = require("../connection");
const jwt = require("jsonwebtoken");

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  const tokenVazio = authorization.split(" ")[1];

  if (!tokenVazio) {
    return res.status(400).json("Não autorizado");
  }
  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, process.env.SENHA_JWT);

    const usuarioExiste = await knex("usuarios").where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json("Usuario não encontrado");
    }

    const { senha, ...usuario } = usuarioExiste;

    req.usuario = usuario;

    next();
  } catch (error) {
    if (
      error.message === "invalid signature" ||
      error.message === "jwt malformed"
    ) {
      return res.status(400).json({ mensagem: "Não autorizado" });
    }
    return res.status(400).json(error.message);
  }
};

module.exports = verificaLogin;
