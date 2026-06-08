const express = require("express");

const router =
express.Router();

const AvaliacaoController =
require("../controller/avaliacao_controller");

router.post(
  "/avaliacao",
  AvaliacaoController.criar
);

router.get(
  "/avaliacao/:id_usuario/:id_produto/:id_pedido",
  AvaliacaoController.buscar
);

router.put(
  "/avaliacao/:id_avaliacao",
  AvaliacaoController.atualizar
);

module.exports = router;