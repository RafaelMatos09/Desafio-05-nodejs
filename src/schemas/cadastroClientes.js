const joi = require("joi");

const schemaCliente = joi
  .object({
    nome: joi.string().required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome não pode estar vazio",
    }),
    email: joi.string().email().required().messages({
      "string.email": "O campo email precisa ter um formato válido",
      "any.required": "O campo email é obrigatorio",
      "string.empty": "O campo nome não pode estar vazio",
    }),
    cpf: joi.string().min(11).required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome não pode estar vazio",
      "string.min": "O campo cpf precisa ter no mínimo 11 caracteres",
    }),
  })
  .unknown(true);

module.exports = schemaCliente;
