const joi = require("joi");

const schemaProduto = joi
  .object({
    descricao: joi.string().required().messages({
      "any.required": "O campo descrição é obrigatório",
      "string.empty": "O campo descrição não pode estar vazio",
    }),
    valor: joi.number().integer().required().messages({
      "any.required": "O campo valor é obrigatório",
      "number.base": "O valor deve ser um número",
      "number.integer": "O valor deve ser um número inteiro",
    }),
    categoria_id: joi.number().integer().required().messages({
      "any.required": "O campo categoria é obrigatório",
      "number.base": "A categoria deve ser um número",
      "number.integer": "A categoria deve ser um número inteiro",
    }),
    quantidade_estoque: joi.number().integer().required().messages({
      "any.required": "O campo quantidade é obrigatório",
      "number.base": "A quantidade deve ser um número",
      "number.integer": "A quantidade deve ser um número inteiro",
    }),
  })
  .unknown(true);

module.exports = schemaProduto;
