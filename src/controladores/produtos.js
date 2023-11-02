const knex = require("../connection");
const { validaCadastro } = require("../validacoes/cadastro");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, produto_imagem, categoria_id } =
    req.body;

  try {
    const categoriaExiste = await validaCadastro(
      "categorias",
      "id",
      categoria_id,
      "insert"
    );

    if (categoriaExiste) {
      return res.status(404).json(categoriaExiste);
    }

    const produto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        produto_imagem,
        categoria_id,
      })
      .returning("*");

    return res.status(201).json(produto[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, produto_imagem, categoria_id } =
    req.body;

  try {
    const produtoExiste = await validaCadastro("produtos", "id", id, "update");
    const categoriaExiste = await validaCadastro(
      "categorias",
      "id",
      categoria_id,
      "insert"
    );
    if (produtoExiste) {
      return res.status(404).json(produtoExiste);
    }
    if (categoriaExiste) {
      return res.status(404).json(categoriaExiste);
    }

    const produto = await knex("produtos")
      .where({ id })
      .update({
        descricao,
        quantidade_estoque,
        valor,
        produto_imagem,
        categoria_id,
      })
      .returning("*");

    return res.status(201).json(produto[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const listarProdutos = async (req, res) => {
  const { categoria_id } = req.query;
  console.log(categoria_id);
  try {
    if (categoria_id !== undefined) {
      const categoriaExiste = await validaCadastro(
        "categorias",
        "id",
        categoria_id,
        "insert"
      );
      if (categoriaExiste) {
        return res.status(404).json(categoriaExiste);
      }
    }

    const produto = await knex("produtos").returning("*");
    let produtoDetalhar;

    if (categoria_id !== undefined) {
      produtoDetalhar = await knex("produtos")
        .where({ categoria_id })
        .returning("*");
    }

    if (categoria_id !== undefined) {
      return res.status(200).json(produtoDetalhar);
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExiste = await validaCadastro("produtos", "id", id, "select");

    if (produtoExiste) {
      return res.status(404).json(produtoExiste);
    }
    const produto = await knex("produtos").where({ id }).returning("*");

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExiste = await validaCadastro("produtos", "id", id, "select");

    if (produtoExiste) {
      return res.status(404).json(produtoExiste);
    }
    validaProduto = await knex("pedidos").where({ cliente_id: id }).first();
    console.log(validaProduto);
    const produto = await knex("produtos").where({ id }).del().returning("*");

    const produtoDetalhar = {
      produto,
      mensagem: "Produto deletado",
    };
    return res.status(200).json(produtoDetalhar);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

module.exports = {
  cadastrarProduto,
  atualizarProduto,
  listarProdutos,
  detalharProduto,
  deletarProduto,
};
