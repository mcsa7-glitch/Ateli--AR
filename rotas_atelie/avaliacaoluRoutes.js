const express = require("express");

const router = express.Router();

const AvaliacaoController =
require("../controller/avaliacaolu_controller");

router.get(
  "/avaliacao/:id_produto",
  AvaliacaoController.listar
);

router.post(
  "/avaliacao/util",
  AvaliacaoController.util
);

module.exports = router;