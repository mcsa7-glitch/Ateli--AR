const express = require("express");
const router = express.Router();

const CarrinhoController =
require("../controller/carrinho_controller");

router.get(
  "/:id_usuario",
  CarrinhoController.listar
);

router.post(
  "/adicionar",
  CarrinhoController.adicionar
);
router.delete(
  "/item/:id_item",
  CarrinhoController.remover
);
router.put(
  "/item/:id_item",
  CarrinhoController.alterarQuantidade
);

router.delete(
  "/limpar-selecionados",
  CarrinhoController.limparSelecionados
);

router.delete(
  "/limpar/:id_usuario",
  CarrinhoController.limpar
);

module.exports = router;