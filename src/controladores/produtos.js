const knex = require("../connection");
const { validaCadastro } = require("../validacoes/cadastro");
const { uploadImagem, excluirImagem } = require("../servicos/uploads");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  console.log(req.body);

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

    const produtoData = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    const produto = await knex("produtos").insert(produtoData).returning("*");

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;

      const imagem = await uploadImagem(
        `produtos/${produto[0].id}/${originalname}`,
        buffer,
        mimetype
      );

      const urlDoBucket = imagem.url;

      await knex("produtos")
        .where("id", produto[0].id)
        .update({ produto_imagem: urlDoBucket });

      produto[0].produto_imagem = urlDoBucket;
    }

    return res.status(201).json(produto[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const atualizarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const produtoId = req.params.id;
  try {
    const categoriaExiste = await validaCadastro(
      "categorias",
      "id",
      categoria_id,
      "update"
    );

    const produtoExiste = await validaCadastro(
      "produtos",
      "id",
      produtoId,
      "update"
    );

    if (categoriaExiste) {
      return res.status(404).json(categoriaExiste);
    }

    if (produtoExiste) {
      return res.status(404).json(produtoExiste);
    }

    let produtoData = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    let imagem;

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;

      imagem = await uploadImagem(
        `produtos/${produtoId}/${originalname}`,
        buffer,
        mimetype
      );

      produtoData.produto_imagem = imagem.url;
    }

    const produto_antigo = await knex("produtos")
      .select("produto_imagem")
      .first();

    const produto = await knex("produtos")
      .where({ id: produtoId })
      .update(produtoData)
      .returning("*");

    if (req.file) {
      if (produto_antigo.produto_imagem) {
        let path_imagem = produto_antigo.produto_imagem.replace(
          "https://desafio-05-cubos.s3.us-east-005.backblazeb2.com/",
          ""
        );

        await excluirImagem(path_imagem);
      }
      produto[0].produto_imagem = imagem.url;
    }

    return res.status(200).json(produto[0]);
  } catch (error) {
    console.log(error.message);
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

    await excluirImagem(
      produto[0].produto_imagem.replace(
        "https://desafio-05-cubos.s3.us-east-005.backblazeb2.com/",
        ""
      )
    );

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
