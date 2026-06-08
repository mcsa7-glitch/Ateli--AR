const db = require("../db");

class Admin {

    // Listar produtos
static async listarProdutos() {

  const result = await db.query(
    `
    SELECT *
    FROM produtos
    ORDER BY id DESC
    `
  );

  return result.rows;

}

// Buscar produto por ID
static async buscarProdutoPorId(id) {

  const result = await db.query(
    `
    SELECT *
    FROM produtos
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];

}

// Adicionar produto
static async adicionarProduto(
  nome,
  descricao,
  preco,
  imagem,
  imagem2,
  imagem3,
  categoria
) {

  return await db.query(
    `
    INSERT INTO produtos
    (
      nome,
      descricao,
      preco,
      imagem,
      imagem2,
      imagem3,
      categoria,
      vendas
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,0)
    RETURNING *
    `,
    [
      nome,
      descricao,
      preco,
      imagem,
      imagem2,
      imagem3,
      categoria
    ]
  );

}

  // Listar todos os pedidos
  static async listarPedidos() {

    const result = await db.query(
      `
      SELECT *
      FROM pedidos
      ORDER BY criado_em DESC
      `
    );

    return result.rows;
  }

  // Excluir produto
  static async excluirProduto(id) {

    const result = await db.query(
      `
      DELETE FROM produtos
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result;
  }
  static async editarProduto(
  id,
  nome,
  descricao,
  preco,
  imagem,
  imagem2,
  imagem3,
  categoria
){

  return await db.query(
    `
    UPDATE produtos
    SET
      nome = $1,
      descricao = $2,
      preco = $3,
      imagem = $4,
      imagem2 = $5,
      imagem3 = $6,
      categoria = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      nome,
      descricao,
      preco,
      imagem,
      imagem2,
      imagem3,
      categoria,
      id
    ]
  );

}

  // Atualizar status do pedido
  static async atualizarStatus(id, status) {

    const result = await db.query(
      `
      UPDATE pedidos
      SET status = $1
      WHERE id_pedido = $2
      RETURNING *
      `,
      [status, id]
    );

    return result;
  }

}

module.exports = Admin;