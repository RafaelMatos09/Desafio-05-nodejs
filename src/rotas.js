const express = require("express");
const categoria = require("./controladores/categorias");
const usuario = require("./controladores/usuarios");
const validarCorpoRequisicao = require("./middlewares/validarCorpoRequisicao");
const schemaUsuario = require("./schemas/cadastroUsuarios");
const verificaLogin = require("./middlewares/login");
const postagens = require("./controladores/postagens");
const cliente = require("./controladores/clientes");
const produto = require("./controladores/produtos");
const login = require("./controladores/login");
const schemaCliente = require("./schemas/cadastroClientes");
const schemaProduto = require("./schemas/cadastroProdutos");
const {
  verificaParametroId,
  verificaQueryId,
} = require("./middlewares/filtroParams");
const { cadastrarPedido, listarPedidos } = require("./controladores/pedidos");
const schemaPedido = require("./schemas/cadastroPedidos");
const multer = require("./middlewares/multer");
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
rotas.post("/postagens/:postagemId", verificaParametroId, postagens.comentar);
rotas.get("/postagens", postagens.feed);
rotas.post(
  "/postagens/:postagemId/curtir",
  verificaParametroId,
  postagens.curtir
);

//clientes
rotas.post(
  "/cliente",
  validarCorpoRequisicao(schemaCliente),
  cliente.cadastrarCliente
);
rotas.put(
  "/cliente/:id",
  verificaParametroId,
  validarCorpoRequisicao(schemaCliente),
  cliente.atualizarCliente
);

//produtos
rotas.post(
  "/produto",
  multer.single("imagem"),
  validarCorpoRequisicao(schemaProduto),
  produto.cadastrarProduto
);
rotas.put(
  "/produto/:id",
  verificaParametroId,
  multer.single("imagem"),
  validarCorpoRequisicao(schemaProduto),
  produto.atualizarProduto
);
rotas.get("/produto", verificaQueryId, produto.listarProdutos);
rotas.get("/produto/:id", verificaParametroId, produto.detalharProduto);
rotas.delete("/produto/:id", verificaParametroId, produto.deletarProduto);
rotas.get("/cliente", cliente.listarClientes);
rotas.get("/cliente/:id", verificaParametroId, cliente.detalharClientes);

//pedidos
rotas.post("/pedido", validarCorpoRequisicao(schemaPedido), cadastrarPedido);
rotas.get("/pedido", verificaQueryId, listarPedidos);
module.exports = rotas;
