const CarrinhoModel =
require("../model/carrinho_model");

class CarrinhoController {

  static async listar(req, res) {

    try {

      const { id_usuario } =
      req.params;

      const itens =
      await CarrinhoModel.buscarPorUsuario(
        id_usuario
      );

      res.json(itens);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar carrinho"
      );

    }

  }

  static async adicionar(req, res) {

    try {

      const {
        id_usuario,
        id_produto,
        quantidade
      } = req.body;

      const qtd = Number(quantidade);

      if (qtd <= 0) {

        return res.status(400).json({
          erro: "Quantidade inválida"
        });

      }

      const carrinho =
      await CarrinhoModel.buscarCarrinho(
        id_usuario
      );

      if (!carrinho) {

        return res.status(404).json({
          erro: "Carrinho não encontrado"
        });

      }

      const item =
      await CarrinhoModel.buscarItem(
        carrinho.id_carrinho,
        id_produto
      );

      if (item) {

        await CarrinhoModel.atualizarQuantidade(
          carrinho.id_carrinho,
          id_produto,
          qtd
        );

        return res.send(
          "Quantidade atualizada"
        );
      }

      await CarrinhoModel.adicionarItem(
        carrinho.id_carrinho,
        id_produto,
        qtd
      );

      res.send(
        "Produto adicionado ao carrinho"
      );

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao adicionar"
      );

    }

  }

  static async alterarQuantidade(
    req,
    res
  ) {

    try {

      const { id_item } =
      req.params;

      const { quantidade } =
      req.body;

      await CarrinhoModel.alterarQuantidade(
        id_item,
        quantidade
      );

      res.send(
        "Quantidade atualizada"
      );

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao atualizar"
      );

    }

  }

  static async limparSelecionados(
    req,
    res
  ) {

    try {

      const { itens } = req.body;

      for (const id_item of itens) {

        await CarrinhoModel.removerItem(
          id_item
        );

      }

      res.json({
        mensagem:
        "Itens removidos"
      });

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao remover"
      );

    }

  }
  static async remover(req, res) {

  try {

    const { id_item } = req.params;

    await CarrinhoModel.removerItem(id_item);

    res.json({
      mensagem: "Item removido"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).send(
      "Erro ao remover item"
    );

  }

}

  static async limpar(req, res) {

    try {

      const { id_usuario } =
      req.params;

      const carrinho =
      await CarrinhoModel.buscarCarrinho(
        id_usuario
      );

      await CarrinhoModel.limparCarrinho(
        carrinho.id_carrinho
      );

      res.json({
        mensagem:
        "Carrinho limpo"
      });

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao limpar"
      );

    }

  }

}

module.exports =
CarrinhoController;