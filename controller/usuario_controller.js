const bcrypt = require("bcrypt");

const usuarioModel =
require("../model/model_usuario");

const usuarioController = {};

// CADASTRO
usuarioController.cadastro =
async (req, res) => {

  const {
    nome,
    email,
    senha,
    telefone,
    endereco
  } = req.body;

  try {

    const usuarioExistente =
      await usuarioModel.buscarPorEmail(email);

    if (
      usuarioExistente.rows.length > 0
    ) {

      return res.status(400).json({
        erro: "Email já cadastrado"
      });

    }

    const senhaHash =
      await bcrypt.hash(senha, 10);

    const novo =
      await usuarioModel.cadastrar(
        nome,
        email,
        senhaHash,
        telefone,
        endereco
      );

    const carrinho =
      await usuarioModel.criarCarrinho(
        novo.rows[0].id_usuario
      );

    res.status(201).json({

      mensagem:
      "Usuário cadastrado",

      id_usuario:
      novo.rows[0].id_usuario,

      id_carrinho:
      carrinho.rows[0].id_carrinho

    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro ao cadastrar"
    });

  }

};

// LOGIN
usuarioController.login =
async (req, res) => {

  const {
    email,
    senha
  } = req.body;

  try {

    const result =
      await usuarioModel.buscarPorEmail(
        email
      );

    if (
      result.rows.length === 0
    ) {

      return res.json({
        erro:
        "Usuário não cadastrado"
      });

    }

    const usuario =
      result.rows[0];

    const senhaValida =
      await bcrypt.compare(
        senha,
        usuario.senha
      );

    if (!senhaValida) {

      return res.json({
        erro:
        "Email ou senha incorretos"
      });

    }

    const carrinho =
      await usuarioModel.buscarCarrinho(
        usuario.id_usuario
      );

    res.json({

      id_usuario:
      usuario.id_usuario,

      nome:
      usuario.nome,

      id_carrinho:
      carrinho.rows[0].id_carrinho,

      especial:
      usuario.especial

    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro no login"
    });

  }

};

// BUSCAR USUÁRIO
usuarioController.buscarUsuario =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const result =
      await usuarioModel.buscarPorId(id);

    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({
        erro:
        "Usuário não encontrado"
      });

    }

    res.json(
      result.rows[0]
    );

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro"
    });

  }

};

// ATUALIZAR
usuarioController.atualizarUsuario =
async (req, res) => {

  const { id } =
    req.params;

  const {
    nome,
    telefone,
    endereco,
    email,
    senha
  } = req.body;

  try {

    let senhaHash = null;

    if (senha) {

      senhaHash =
        await bcrypt.hash(
          senha,
          10
        );

    }

    await usuarioModel.atualizar(
      id,
      nome,
      telefone,
      endereco,
      email,
      senhaHash
    );

    res.json({
      mensagem:
      "Atualizado com sucesso"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro"
    });

  }

};

// EXCLUIR
usuarioController.excluirUsuario =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const result =
      await usuarioModel.excluir(id);

    if (
      result.rowCount === 0
    ) {

      return res.status(404).json({
        erro:
        "Usuário não encontrado"
      });

    }

    res.json({
      mensagem:
      "Usuário excluído"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro:
      "Erro ao excluir"
    });

  }

};

module.exports =
usuarioController;