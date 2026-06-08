const AvaliacaoModel =
require("../model/avaliacao_model");

class AvaliacaoController {

  static async criar(req, res) {

    try {

      const {
        id_usuario,
        id_produto,
        id_pedido,
        estrelas,
        comentario
      } = req.body;

      const existe =
      await AvaliacaoModel.verificarAvaliacao(
        id_usuario,
        id_produto,
        id_pedido
      );

      if(existe.length > 0){

        return res.status(400).json({
          erro:
          "Você já avaliou este produto."
        });

      }

      const avaliacao =
      await AvaliacaoModel.criar(
        id_usuario,
        id_produto,
        id_pedido,
        estrelas,
        comentario
      );

      res.status(201).json({
        mensagem:
        "Avaliação cadastrada com sucesso!",
        avaliacao
      });

    } catch(err){

      console.log(err);

      res.status(500).json({
        erro:
        "Erro ao cadastrar avaliação."
      });

    }

  }

  static async buscar(req,res){

    try{

      const {
        id_usuario,
        id_produto,
        id_pedido
      } = req.params;

      const avaliacao =
      await AvaliacaoModel.buscar(
        id_usuario,
        id_produto,
        id_pedido
      );

      res.json(avaliacao || null);

    }catch(err){

      console.log(err);

      res.status(500).json({
        erro:
        "Erro ao buscar avaliação"
      });

    }

  }

  static async atualizar(req,res){

    try{

      const { id_avaliacao } =
      req.params;

      const {
        estrelas,
        comentario
      } = req.body;

      const avaliacao =
      await AvaliacaoModel.atualizar(
        id_avaliacao,
        estrelas,
        comentario
      );

      res.json({
        mensagem:
        "Avaliação atualizada",
        avaliacao
      });

    }catch(err){

      console.log(err);

      res.status(500).json({
        erro:
        "Erro ao atualizar avaliação"
      });

    }

  }

}

module.exports =
AvaliacaoController;