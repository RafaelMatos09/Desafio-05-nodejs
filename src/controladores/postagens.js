const knex = require("../connection");

const novaPostagem = async (req, res) => {
  const { id } = req.usuario;
  const { texto, fotos } = req.body;

  if (!fotos || fotos.length === 0)
    return res.status(404).json("É preciso informar ao menos uma foto");

  try {
    const postagem = await knex("postagens")
      .insert({ texto, usuario_id: id })
      .returning("*");

    if (!postagem)
      return res.status(400).json("Não foi possível concluir a postagem");

    for (const foto of fotos) {
      foto.postagem_id = postagem[0].id;
    }

    const fotosCadastradas = await knex("postagem_fotos").insert(fotos);

    if (!fotosCadastradas) {
      await knex("postagens").where({ id: postagem[0].id }).del();
      return res.status(400).json("Não foi possível concluir a postagem");
    }

    return res.status(200).json("Postagem realizada com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const comentar = async (req, res) => {
  const { id } = req.usuario;
  const { postagemId } = req.params;
  const { texto } = req.body;

  if (!texto) {
    return res.status(404).json({
      mensagem: "Para comentar nessa postagem é necessário informar o texto.",
    });
  }

  try {
    const postagem = await knex("postagens").where({ id: postagemId }).first();

    if (!postagem) {
      return res.status(404).json({ mensagem: "Postagem não encontrada." });
    }

    const comentario = await knex("postagem_comentarios").insert({
      usuario_id: id,
      postagem_id: postagem.id,
      texto,
    });

    if (!comentario) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possivel comentar nessa postagem" });
    }

    return res.status(200).json("Postagem comentada com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  novaPostagem,
  comentar,
};
