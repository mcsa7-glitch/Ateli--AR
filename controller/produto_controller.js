const ProdutoModel = require("../model/model_produto");

class ProdutoController {

  static async listar(req, res) {

    try {

      const produtos =
        await ProdutoModel.listar();

      res.json(produtos);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar produtos"
      );

    }

  }

  static async buscarPorId(req, res) {

    try {

      const produto =
        await ProdutoModel.buscarPorId(
          req.params.id
        );

      res.json(produto);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar produto"
      );

    }

  }
    static async buscarPorId(req, res) {

    const { id } = req.params;

    try {

      const produto =
        await ProdutoModel.buscarPorId(id);

      res.json(produto);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar produto"
      );

    }

  }

  static async destaques(req, res) {

    try {

      const produtos =
        await ProdutoModel.buscarDestaques();

      res.json(produtos);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar destaques"
      );

    }

  }

  static async categoria(req, res) {

    try {

      const categoria =
        req.params.categoria
          .toLowerCase()
          .trim();

      const produtos =
        await ProdutoModel.buscarPorCategoria(
          categoria
        );

      res.json(produtos);

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao buscar categoria"
      );

    }

  }

  static async criar(req, res) {

    try {

      await ProdutoModel.criar(
        req.body
      );

      res.send(
        "Produto adicionado"
      );

    } catch (erro) {

      console.log(erro);

      res.status(500).send(
        "Erro ao adicionar produto"
      );

    }

  }

}

module.exports = ProdutoController;