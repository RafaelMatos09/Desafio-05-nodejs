const joi = require("joi");

const schemaPedido = joi.object({
  cliente_id: joi.number().integer().required().messages({
    "any.required": "O campo cliente_id é obrigatório",
    "number.base": "O cliente_id deve ser um número",
    "number.integer": "O cliente_id deve ser um número inteiro",
  }),
  observacao: joi.string().required().messages({
    "any.required": "O campo observacao é obrigatório",
    "string.empty": "O campo observacao não pode estar vazio",
  }),
  pedido_produtos: joi
    .array()
    .items(
      joi.object({
        produto_id: joi.number().required().messages({
          "any.required": "O campo produto_id é obrigatório",
          "number.base": "O produto_id deve ser um número",
        }),
        quantidade_produto: joi.number().required().messages({
          "any.required": "O campo quantidade_produto é obrigatório",
          "number.base": "A quantidade_produto deve ser um número",
        }),
      })
    )
    .messages({
      "any.required": "O campo pedido_produtos é obrigatório",
    }),
});

module.exports = schemaPedido;
