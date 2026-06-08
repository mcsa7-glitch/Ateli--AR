const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const AdminController =
require("../controller/adminController");

router.get(
  "/produtos",
  AdminController.listarProdutos
);

router.post(
  "/produtos",
  upload.fields([
    { name: "imagem", maxCount: 1 },
    { name: "imagem2", maxCount: 1 },
    { name: "imagem3", maxCount: 1 }
  ]),
  AdminController.adicionarProduto
);
router.put(
  "/produtos/:id",
  upload.fields([
    { name: "imagem", maxCount: 1 },
    { name: "imagem2", maxCount: 1 },
    { name: "imagem3", maxCount: 1 }
  ]),
  AdminController.editarProduto
);

router.delete(
  "/produtos/:id",
  AdminController.excluirProduto
);

router.get(
  "/pedidos",
  AdminController.listarPedidos
);

router.put(
  "/pedido/status/:id",
  AdminController.atualizarStatus
);

module.exports = router;