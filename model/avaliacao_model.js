const db = require("../db");

class AvaliacaoModel {

  static async verificarAvaliacao(
    id_usuario,
    id_produto,
    id_pedido
  ) {

    const result = await db.query(
      `
      SELECT *
      FROM avaliacao
      WHERE id_usuario = $1
      AND id_produto = $2
      AND id_pedido = $3
      `,
      [id_usuario, id_produto, id_pedido]
    );

    return result.rows;
  }

  static async criar(
    id_usuario,
    id_produto,
    id_pedido,
    estrelas,
    comentario
  ) {

    const result = await db.query(
      `
      INSERT INTO avaliacao
      (
        id_usuario,
        id_produto,
        id_pedido,
        estrelas,
        comentario
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        id_usuario,
        id_produto,
        id_pedido,
        estrelas,
        comentario
      ]
    );

    return result.rows[0];
  }

  static async buscar(
    id_usuario,
    id_produto,
    id_pedido
  ) {

    const result = await db.query(
      `
      SELECT *
      FROM avaliacao
      WHERE id_usuario = $1
      AND id_produto = $2
      AND id_pedido = $3
      `,
      [
        id_usuario,
        id_produto,
        id_pedido
      ]
    );

    return result.rows[0];
  }

  static async atualizar(
    id_avaliacao,
    estrelas,
    comentario
  ) {

    const result = await db.query(
      `
      UPDATE avaliacao
      SET
      estrelas = $1,
      comentario = $2
      WHERE id_avaliacao = $3
      RETURNING *
      `,
      [
        estrelas,
        comentario,
        id_avaliacao
      ]
    );

    return result.rows[0];
  }

}

module.exports = AvaliacaoModel;