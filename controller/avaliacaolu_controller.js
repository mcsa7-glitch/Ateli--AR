const AvaliacaoModel =
require("../model/avaliacaolu_model");

class AvaliacaoController {

  static async listar(req, res) {

    try {

      const { id_produto } = req.params;

      const id_usuario =
      req.query.id_usuario || 0;

      const avaliacoes =
      await AvaliacaoModel.listarPorProduto(
        id_produto,
        id_usuario
      );

      const resumo =
      await AvaliacaoModel.resumo(
        id_produto
      );

      res.json({
        resumo,
        avaliacoes
      });

    } catch (erro) {

      console.log(erro);

      res.status(500).json({
        erro: "Erro ao buscar avaliações"
      });

    }

  }

  static async util(req, res) {

    try {

      const {
        id_usuario,
        id_avaliacao,
        tipo_util
      } = req.body;

      const dono =
      await AvaliacaoModel.buscarDono(
        id_avaliacao
      );

      if (
        dono &&
        dono.id_usuario == id_usuario
      ) {

        return res.status(400).json({
          erro:
          "Você não pode avaliar sua própria avaliação."
        });

      }

      const existe =
      await AvaliacaoModel.buscarUtil(
        id_usuario,
        id_avaliacao
      );

      if (existe) {

        if (
          existe.tipo_util === tipo_util
        ) {

          await AvaliacaoModel.removerUtil(
            id_usuario,
            id_avaliacao
          );

        } else {

          await AvaliacaoModel.atualizarUtil(
            tipo_util,
            id_usuario,
            id_avaliacao
          );

        }

      } else {

        await AvaliacaoModel.criarUtil(
          id_usuario,
          id_avaliacao,
          tipo_util
        );

      }

      const totais =
      await AvaliacaoModel.totais(
        id_avaliacao
      );

      const ativo =
      await AvaliacaoModel.buscarUtil(
        id_usuario,
        id_avaliacao
      );

      res.json({

        ativo: !!ativo,

        total_positivo:
        totais.total_positivo,

        total_negativo:
        totais.total_negativo

      });

    } catch (erro) {

      console.log(erro);

      res.status(500).send("Erro");

    }

  }

}

module.exports =
AvaliacaoController;