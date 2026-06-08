
const express = require("express");

const router =
  express.Router();

const PedidoController =
  require("../controller/pedido_controller");

router.post(
  "/criar-pagamento",
  PedidoController.criarPagamento
);

router.post(
  "/webhook",
  PedidoController.webhook
);

router.get(
  "/pedido/:id",
  PedidoController.buscarPedido
);

router.get(
  "/pedidos/usuario/:id_usuario",
  PedidoController.listarUsuario
);

module.exports = router;