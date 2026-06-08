require('dotenv').config();


const express = require("express");
const cors = require("cors");
const usuarioRoutes =
require("./rotas_atelie/usuarioRoutes");
const adminRoutes = 
require("./rotas_atelie/adminRoutes");
const produtoRoutes =
require("./rotas_atelie/produtoRoutes");
const carrinhoRoutes =
require("./rotas_atelie/carrinhoRoutes");
const avaliacaoRoutes =
require("./rotas_atelie/avaliacaoRoutes");
const avaliacaoluRoutes =
require("./rotas_atelie/avaliacaoluRoutes");
const pedidoRoutes =
require("./rotas_atelie/pedidoRoutes");



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use(express.static("."));
app.use(
  "/uploads",
  express.static("uploads")
);
app.use("/usuarios", usuarioRoutes);
app.use("/admin", adminRoutes);
app.use("/produtos", produtoRoutes);
app.use( "/carrinho",carrinhoRoutes);
app.use("/api",avaliacaoRoutes);
app.use("/api",avaliacaoluRoutes);
app.use("/", pedidoRoutes);
// MERCADO PAGO


app.listen(3000, () => {

  console.log(
    "Servidor rodando em http://localhost:3000"
  );

});