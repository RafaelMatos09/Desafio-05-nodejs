const verificaParametroId = async (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ mensagem: "Id informado inválido" });
  }
  next();
};

const verificaQueryId = async (req, res, next) => {
  const { categoria_id } = req.query;
  if (categoria_id) {
    if (isNaN(categoria_id)) {
      return res.status(400).json({ mensagem: "Id informado inválido" });
    }
  }
  next();
};

module.exports = {
  verificaParametroId,
  verificaQueryId,
};
