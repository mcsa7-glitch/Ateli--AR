const crypto = require("crypto");
const PedidoModel = require("../model/pedido_model");

const {
  MercadoPagoConfig,
  Preference
} = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

class PedidoController {

  static async criarPagamento(req, res) {

    try {

      const {
        id_usuario,
        produtos,
        total,
        frete
      } = req.body;

      const codigoPedido =
        "PED-" +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      const pedido =
        await PedidoModel.criarPedido({
          codigo_pedido: codigoPedido,
          id_usuario,
          total,
          status: "pendente",
          nome: req.body.nome,
          cpf: req.body.cpf,
          cep: req.body.cep,
          rua: req.body.rua,
          numero: req.body.numero,
          bairro: req.body.bairro,
          complemento: req.body.complemento
        });

      for (const produto of produtos) {

        await PedidoModel.salvarItem(
          pedido.id_pedido,
          produto.id,
          produto.quantidade,
          produto.preco
        );

      }

      const itensMercadoPago =
        produtos.map(produto => ({
          id: String(produto.id),
          title: produto.nome,
          quantity: Number(produto.quantidade),
          currency_id: "BRL",
          unit_price: Number(produto.preco)
        }));

      if (Number(frete) > 0) {

        itensMercadoPago.push({
          id: "frete",
          title: "Frete",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(frete)
        });

      }

      const preference =
        new Preference(client);

      const result =
        await preference.create({
          body: {
            items: itensMercadoPago
          }
        });

      await PedidoModel.atualizarPagamento(
        pedido.id_pedido,
        result.id
      );

      res.json({
        pedido_id: pedido.id_pedido,
        init_point: result.init_point
      });

    } catch (erro) {

      console.log(erro);

      res.status(500).json({
        error: erro.message
      });

    }
  }

  static async webhook(req, res) {

    try {

      const payment = req.body;

      if (payment.type === "payment") {

        const paymentId =
          payment.data.id;

        const response =
          await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${process.env.MP_ACCESS_TOKEN}`
              }
            }
          );

        const data =
          await response.json();

        await PedidoModel.atualizarStatus(
          data.status,
          paymentId
        );
      }

      res.sendStatus(200);

    } catch (erro) {

      console.log(erro);

      res.sendStatus(500);

    }
  }

  static async buscarPedido(req, res) {

    try {

      const pedido =
        await PedidoModel.buscarPedido(
          req.params.id
        );

      const itens =
        await PedidoModel.buscarItens(
          req.params.id
        );

      res.json({
        pedido,
        itens
      });

    } catch (erro) {

      res.status(500).json({
        error: "Erro ao buscar pedido"
      });

    }
  }

  static async listarUsuario(req, res) {

    try {

      const pedidos =
        await PedidoModel.listarPorUsuario(
          req.params.id_usuario
        );

      res.json(pedidos);

    } catch (erro) {

      res.status(500).json({
        error: "Erro ao buscar pedidos"
      });

    }
  }
}

module.exports = PedidoController;