const knex = require("../connection");
const { validaCadastro } = require("../validacoes/cadastro");
const { uploadImagem } = require("../servicos/uploads");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, produto_imagem, categoria_id } =
    req.body;
  const { originalname, mimetype, buffer } = req.file;

  console.log(req.body);

  if (!descricao || typeof descricao !== "string" || descricao.trim() === "") {
    return res.status(400).json({ mensagem: "A descrição é inválida." });
  }

  if (
    !quantidade_estoque ||
    isNaN(quantidade_estoque) ||
    quantidade_estoque < 0
  ) {
    return res
      .status(400)
      .json({ mensagem: "A quantidade em estoque é inválida." });
  }

  if (!valor || isNaN(valor) || valor < 0) {
    return res.status(400).json({ mensagem: "O valor é inválido." });
  }

  if (!categoria_id || isNaN(categoria_id) || categoria_id < 1) {
    return res.status(400).json({ mensagem: "A categoria é inválida." });
  }

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

    let produto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        produto_imagem,
        categoria_id,
      })
      .returning("*");

    const imagem = await uploadImagem(
      `produtos/${produto[0].id}/${originalname}`,
      buffer,
      mimetype
    );

    produto = await knex("produtos")
      .update({
        produto_imagem: imagem.path,
      })
      .where({ id: produto[0].id })
      .returning("*");

    produto[0].produto_imagem = imagem.url;

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
  const { originalname, mimetype, buffer } = req.file;

  if (!descricao || typeof descricao !== "string" || descricao.trim() === "") {
    return res.status(400).json({ mensagem: "A descrição é inválida." });
  }

  if (
    !quantidade_estoque ||
    isNaN(quantidade_estoque) ||
    quantidade_estoque < 0
  ) {
    return res
      .status(400)
      .json({ mensagem: "A quantidade em estoque é inválida." });
  }

  if (!valor || isNaN(valor) || valor < 0) {
    return res.status(400).json({ mensagem: "O valor é inválido." });
  }

  if (!categoria_id || isNaN(categoria_id) || categoria_id < 1) {
    return res.status(400).json({ mensagem: "A categoria é inválida." });
  }

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
    const validaProduto = await knex("pedido_produtos")
      .where({ produto_id: id })
      .first();

    if (validaProduto) {
      return res.status(400).json({
        mensagem: "Produto não pode ser deletado, está vinculado a um pedido!",
      });
    }
    const produto = await knex("produtos").where({ id }).del().returning("*");

    const produtoDetalhar = {
      produto,
      mensagem: "Produto deletado",
    };
    return res.status(200).json(produtoDetalhar);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        mensagem:
          "Produto não pode ser deletado, está vinculado a um pedido! [i]",
      });
    }
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
