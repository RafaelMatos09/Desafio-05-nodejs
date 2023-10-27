const express = require("express");
const categoria = require("./controladores/categorias");
const usuario = require("./controladores/usuarios");
const validarCorpoRequisicao = require("./middlewares/validarCorpoRequisicao");
const schemaUsuario = require("./schemas/cadastroUsuarios");
const verificaLogin = require("./middlewares/login");
const postagens = require("./controladores/postagens");
const cliente = require("./controladores/clientes");
const login = require("./controladores/login");
const schemaCliente = require("./schemas/cadastroClientes");
const rotas = express();

rotas.get("/categoria", categoria.listar);
rotas.post(
  "/usuario",
  validarCorpoRequisicao(schemaUsuario),
  usuario.cadastrar
);
rotas.post("/login", login.loginUsuario);

rotas.use(verificaLogin);

rotas.put(
  "/usuario",
  validarCorpoRequisicao(schemaUsuario),
  usuario.atualizarUsuario
);
rotas.get("/usuario", usuario.listarUsuario);

//postagens
rotas.post("/postagens", postagens.novaPostagem);
rotas.post("/postagens/:postagemId", postagens.comentar);
rotas.get("/postagens", postagens.feed);
rotas.post("/postagens/:postagemId/curtir", postagens.curtir);

//clientes
rotas.post(
  "/cliente",
  validarCorpoRequisicao(schemaCliente),
  cliente.cadastrarCliente
);
module.exports = rotas;
