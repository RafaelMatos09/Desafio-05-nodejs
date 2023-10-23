const express = require("express");
const categoria = require("./controladores/categorias");
const usuario = require("./controladores/usuarios");
const validarCorpoRequisicao = require("./validacoes/validarCorpoRequisicao");
const schemaUsuario = require("./schemas/cadastroUsuarios");
const verificaLogin = require("./middlewares/login");
const login = require("./controladores/login");
const rotas = express();

rotas.get("/categoria", categoria.listar);
rotas.post(
  "/usuario",
  validarCorpoRequisicao(schemaUsuario),
  usuario.cadastrar
);
rotas.post("/login", login.loginUsuario);

rotas.use(verificaLogin);

rotas.get("/usuario", usuario.listarUsuario);
rotas.put(
  "/usuario",
  validarCorpoRequisicao(schemaUsuario),
  usuario.atualizarUsuario
);

module.exports = rotas;
