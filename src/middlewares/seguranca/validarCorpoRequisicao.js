const validarCorpoRequisicao = (joiSchema) => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = validarCorpoRequisicao;
