const db = require('../db');

// Buscar por email
exports.buscarPorEmail = async (email) => {

  const result = await db.query(
    "SELECT * FROM usuario WHERE email = $1",
    [email]
  );

  return result;
};

// Cadastrar usuário
exports.cadastrar = async (
  nome,
  email,
  senha,
  telefone,
  endereco
) => {

  const result = await db.query(
    `
    INSERT INTO usuario
    (nome,email,senha,telefone,endereco)

    VALUES
    ($1,$2,$3,$4,$5)

    RETURNING *
    `,
    [nome, email, senha, telefone, endereco]
  );

  return result;
};

// Criar carrinho
exports.criarCarrinho = async (id_usuario) => {

  const result = await db.query(
    `
    INSERT INTO carrinho
    (id_usuario)

    VALUES ($1)

    RETURNING *
    `,
    [id_usuario]
  );

  return result;
};

// Buscar usuário por ID
exports.buscarPorId = async (id) => {

  const result = await db.query(
    `
    SELECT *
    FROM usuario

    WHERE id_usuario = $1
    `,
    [id]
  );

  return result;
};

// Atualizar usuário
exports.atualizar = async (
  id,
  nome,
  telefone,
  endereco,
  email,
  senhaHash
) => {

  return await db.query(
    `
    UPDATE usuario

    SET
      nome = $1,
      telefone = $2,
      endereco = $3,
      email = $4,
      senha = COALESCE($5, senha)

    WHERE id_usuario = $6
    `,
    [
      nome,
      telefone,
      endereco,
      email,
      senhaHash,
      id
    ]
  );

};

// Excluir usuário
exports.excluir = async (id) => {

  return await db.query(
    `
    DELETE FROM usuario

    WHERE id_usuario = $1

    RETURNING *
    `,
    [id]
  );

};

// Buscar carrinho
exports.buscarCarrinho = async (id_usuario) => {

  return await db.query(
    `
    SELECT *
    FROM carrinho

    WHERE id_usuario = $1
    `,
    [id_usuario]
  );

};