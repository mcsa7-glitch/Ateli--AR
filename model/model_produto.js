const db = require("../db");

class ProdutoModel {

  static async listar() {
    const result = await db.query(
      "SELECT * FROM produtos"
    );

    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await db.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

    return result.rows[0];
  }

  static async buscarDestaques() {
    const result = await db.query(`
      SELECT *
      FROM produtos
      ORDER BY vendas DESC
      LIMIT 6
    `);

    return result.rows;
  }

  static async buscarPorCategoria(categoria) {
    const result = await db.query(
      `SELECT *
       FROM produtos
       WHERE LOWER(TRIM(categoria)) = $1`,
      [categoria]
    );

    return result.rows;
  }
  static async buscarPorId(id) {

    const result = await db.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

    return result.rows[0];
  }

  static async criar(produto) {

    const {
      nome,
      descricao,
      preco,
      imagem,
      categoria
    } = produto;

    await db.query(
      `
      INSERT INTO produtos
      (
        nome,
        descricao,
        preco,
        imagem,
        categoria,
        vendas
      )
      VALUES
      ($1,$2,$3,$4,$5,0)
      `,
      [
        nome,
        descricao,
        preco,
        imagem,
        categoria
      ]
    );
  }
}

module.exports = ProdutoModel;