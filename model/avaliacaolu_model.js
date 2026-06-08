const db = require("../db");

class AvaliacaoModel {

  static async listarPorProduto(id_produto, id_usuario) {

    const avaliacoes = await db.query(
      `
      SELECT
        a.id_avaliacao,
        a.estrelas,
        a.comentario,

        TO_CHAR(
          a.criado_em,
          'DD/MM/YYYY'
        ) AS criado_em,

        u.nome,

        COUNT(
          CASE
            WHEN ua.tipo_util = TRUE
            THEN 1
          END
        ) AS total_positivo,

        COUNT(
          CASE
            WHEN ua.tipo_util = FALSE
            THEN 1
          END
        ) AS total_negativo,

        MAX(
          CASE
            WHEN ua.id_usuario = $2
            AND ua.tipo_util = TRUE
            THEN 1
            ELSE 0
          END
        ) AS usuario_curtiu_positivo,

        MAX(
          CASE
            WHEN ua.id_usuario = $2
            AND ua.tipo_util = FALSE
            THEN 1
            ELSE 0
          END
        ) AS usuario_curtiu_negativo

      FROM avaliacao a

      INNER JOIN usuario u
      ON u.id_usuario = a.id_usuario

      LEFT JOIN util_avaliacao ua
      ON ua.id_avaliacao = a.id_avaliacao

      WHERE a.id_produto = $1

      GROUP BY
        a.id_avaliacao,
        a.estrelas,
        a.comentario,
        a.criado_em,
        u.nome

      ORDER BY a.criado_em DESC
      `,
      [id_produto, id_usuario]
    );

    return avaliacoes.rows;
  }

  static async resumo(id_produto) {

    const result = await db.query(
      `
      SELECT
        ROUND(AVG(estrelas),1) AS media_estrelas,
        COUNT(*) AS total_avaliacoes
      FROM avaliacao
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return result.rows[0];
  }

  static async buscarDono(id_avaliacao) {

    const result = await db.query(
      `
      SELECT id_usuario
      FROM avaliacao
      WHERE id_avaliacao = $1
      `,
      [id_avaliacao]
    );

    return result.rows[0];
  }

  static async buscarUtil(id_usuario, id_avaliacao) {

    const result = await db.query(
      `
      SELECT *
      FROM util_avaliacao
      WHERE id_usuario = $1
      AND id_avaliacao = $2
      `,
      [id_usuario, id_avaliacao]
    );

    return result.rows[0];
  }

  static async removerUtil(id_usuario, id_avaliacao) {

    return db.query(
      `
      DELETE FROM util_avaliacao
      WHERE id_usuario = $1
      AND id_avaliacao = $2
      `,
      [id_usuario, id_avaliacao]
    );
  }

  static async atualizarUtil(tipo_util, id_usuario, id_avaliacao) {

    return db.query(
      `
      UPDATE util_avaliacao
      SET tipo_util = $1
      WHERE id_usuario = $2
      AND id_avaliacao = $3
      `,
      [tipo_util, id_usuario, id_avaliacao]
    );
  }

  static async criarUtil(id_usuario, id_avaliacao, tipo_util) {

    return db.query(
      `
      INSERT INTO util_avaliacao
      (id_usuario, id_avaliacao, tipo_util)
      VALUES ($1,$2,$3)
      `,
      [id_usuario, id_avaliacao, tipo_util]
    );
  }

  static async totais(id_avaliacao) {

    const result = await db.query(
      `
      SELECT

      COUNT(
        CASE
          WHEN tipo_util = TRUE
          THEN 1
        END
      ) AS total_positivo,

      COUNT(
        CASE
          WHEN tipo_util = FALSE
          THEN 1
        END
      ) AS total_negativo

      FROM util_avaliacao

      WHERE id_avaliacao = $1
      `,
      [id_avaliacao]
    );

    return result.rows[0];
  }

}

module.exports = AvaliacaoModel;