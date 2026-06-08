const express = require("express");

const router = express.Router();

const ProdutoController =
require("../controller/produto_controller");

router.get("/", ProdutoController.listar);
router.get("/destaques", ProdutoController.destaques);
router.get("/categoria/:categoria", ProdutoController.categoria);
router.get("/:id", ProdutoController.buscarPorId);
router.post("/", ProdutoController.criar);
router.get("/produtos/:id",ProdutoController.buscarPorId);
module.exports = router;