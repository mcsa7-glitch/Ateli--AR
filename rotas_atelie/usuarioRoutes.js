const router =
require("express").Router();

const usuarioController =
require("../controller/usuario_controller");

router.post(
  "/cadastro",
  usuarioController.cadastro
);

router.post(
  "/login",
  usuarioController.login
);

router.get(
  "/usuario/:id",
  usuarioController.buscarUsuario
);

router.put(
  "/usuario/:id",
  usuarioController.atualizarUsuario
);

router.delete(
  "/usuario/:id",
  usuarioController.excluirUsuario
);

module.exports = router;