const knex = require("../connection");
const { validaCadastro } = require("../validacoes/cadastro");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  try {
    const clienteExiste = await validaCadastro(
      "clientes",
      "id",
      cliente_id,
      "select"
    );

    if (clienteExiste) {
      return res.status(404).json(clienteExiste);
    }

    for (j = 0; j < pedido_produtos.length; j++) {
      const estoque = await knex("produtos")
        .select("quantidade_estoque", "valor")
        .where({ id: pedido_produtos[j].produto_id })
        .first();

      if (estoque.quantidade_estoque < pedido_produtos[j].quantidade_produto) {
        return res
          .status(400)
          .json({ mensagem: "Quantidade em estoque insuficiente" });
      }
    }

    for (i = 0; i < pedido_produtos.length; i++) {
      console.log(pedido_produtos[i].produto_id);
      console.log(pedido_produtos[i].quantidade_produto);
      const produtoExiste = await validaCadastro(
        "produtos",
        "id",
        pedido_produtos[i].produto_id,
        "select"
      );

      if (produtoExiste) {
        return res.status(404).json(produtoExiste);
      }

      const estoque = await knex("produtos")
        .select("quantidade_estoque", "valor")
        .where({ id: pedido_produtos[i].produto_id })
        .first();
      console.log(estoque.quantidade_estoque);

      const valorTotalItem =
        estoque.valor * pedido_produtos[i].quantidade_produto;
      console.log(valorTotalItem);
      const pedido = await knex("pedidos")
        .insert({
          cliente_id,
          observacao,
          valor_total: valorTotalItem,
        })
        .returning("*");

      console.log(pedido);

      const pedido_produtos_ = await knex("pedido_produtos").insert({
        pedido_id: pedido[0].id,
        produto_id: pedido_produtos[i].produto_id,
        quantidade_produto: pedido_produtos[i].quantidade_produto,
        valor_produto: estoque.valor,
      });
      const valorAtualizadoEstoque =
        estoque.quantidade_estoque - pedido_produtos[i].quantidade_produto;
      const atualizaEstoque = await knex("produtos")
        .where({ id: pedido_produtos[i].produto_id })
        .update({
          quantidade_estoque: valorAtualizadoEstoque,
        });
    }
    return res.status(201).json("all right");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

module.exports = {
  cadastrarPedido,
};
