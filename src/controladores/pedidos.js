const knex = require("../connection");
const enviarEmail = require("../servicos/nodemailer");
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

    const clienteEmail = await knex("clientes")
      .where({ id: cliente_id })
      .returning("email");

    for (const pedidoProduto of pedido_produtos) {
      const produtoExiste = await validaCadastro(
        "produtos",
        "id",
        pedidoProduto.produto_id,
        "select"
      );

      if (produtoExiste) {
        return res.status(404).json(produtoExiste);
      }

      const estoque = await knex("produtos")
        .select("quantidade_estoque", "valor")
        .where({ id: pedidoProduto.produto_id })
        .first();

      if (estoque.quantidade_estoque < pedidoProduto.quantidade_produto) {
        return res
          .status(400)
          .json({ mensagem: "Quantidade em estoque insuficiente" });
      }
    }

    const transaction = await knex.transaction();

    try {
      let valorTotalPedido = 0;

      const pedido = await transaction("pedidos")
        .insert({
          cliente_id,
          observacao,
          valor_total: valorTotalPedido,
        })
        .returning("id");

      for (const pedidoProduto of pedido_produtos) {
        const produtoInfo = await transaction("produtos")
          .select("valor")
          .where({ id: pedidoProduto.produto_id })
          .first();

        const valorTotalItem =
          produtoInfo.valor * pedidoProduto.quantidade_produto;
        valorTotalPedido += valorTotalItem;

        await transaction("pedido_produtos").insert({
          pedido_id: pedido[0].id,
          produto_id: pedidoProduto.produto_id,
          quantidade_produto: pedidoProduto.quantidade_produto,
          valor_produto: produtoInfo.valor,
        });

        await transaction("produtos")
          .where({ id: pedidoProduto.produto_id })
          .decrement("quantidade_estoque", pedidoProduto.quantidade_produto);
      }

      await transaction("pedidos")
        .where({ id: pedido[0].id })
        .update({ valor_total: valorTotalPedido });

      await transaction.commit();

      await enviarEmail(clienteEmail[0].email, {
        cliente_id,
        observacao,
        pedido_produtos,
        valor_total: valorTotalPedido,
      });

      return res
        .status(201)
        .json({ mensagem: "Pedido cadastrado com sucesso" });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarPedidos = async (req, res) => {
  const { cliente_id } = req.query;

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

    let pedidos = [];

    if (cliente_id) {
      pedidos = await knex
        .select(
          "p.id",
          "p.valor_total",
          "p.observacao",
          "p.cliente_id",
          "pp.id as pp_id",
          "pp.quantidade_produto",
          "pp.valor_produto",
          "pp.pedido_id",
          "pp.produto_id"
        )
        .from("pedidos as p")
        .join("pedido_produtos as pp", "pp.pedido_id", "p.id")
        .where("p.cliente_id", cliente_id);
    } else {
      pedidos = await knex
        .select(
          "p.id",
          "p.valor_total",
          "p.observacao",
          "p.cliente_id",
          "pp.id as pp_id",
          "pp.quantidade_produto",
          "pp.valor_produto",
          "pp.pedido_id",
          "pp.produto_id"
        )
        .from("pedidos as p")
        .join("pedido_produtos as pp", "pp.pedido_id", "p.id");
    }

    const detalharPedido = pedidos.reduce((accumulator, row) => {
      const existePedido = accumulator.find(
        (item) => item.pedido.id === row.id
      );

      if (existePedido) {
        existePedido.pedido_produtos.push({
          id: row.pp_id,
          quantidade_produto: row.quantidade_produto,
          valor_produto: row.valor_produto,
          pedido_id: row.pedido_id,
          produto_id: row.produto_id,
        });
      } else {
        accumulator.push({
          pedido: {
            id: row.id,
            valor_total: row.valor_total,
            observacao: row.observacao,
            cliente_id: row.cliente_id,
          },
          pedido_produtos: [
            {
              id: row.pp_id,
              quantidade_produto: row.quantidade_produto,
              valor_produto: row.valor_produto,
              pedido_id: row.pedido_id,
              produto_id: row.produto_id,
            },
          ],
        });
      }

      return accumulator;
    }, []);

    return res.status(200).json(detalharPedido);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
