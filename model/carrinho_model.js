const db = require("../db");

class CarrinhoModel {

  static async buscarPorUsuario(id_usuario) {

    const result = await db.query(
      `
      SELECT
        ic.id_item,
        p.id,
        p.nome,
        p.preco,
        p.imagem,
        ic.quantidade,
        (p.preco * ic.quantidade) AS subtotal

      FROM item_carrinho ic

      JOIN produtos p
      ON ic.id_produto = p.id

      JOIN carrinho c
      ON ic.id_carrinho = c.id_carrinho

      WHERE c.id_usuario = $1
      `,
      [id_usuario]
    );

    return result.rows;
  }

  static async buscarCarrinho(id_usuario) {

    const result = await db.query(
      `
      SELECT *
      FROM carrinho
      WHERE id_usuario = $1
      `,
      [id_usuario]
    );

    return result.rows[0];
  }

  static async buscarItem(id_carrinho, id_produto) {

    const result = await db.query(
      `
      SELECT *
      FROM item_carrinho
      WHERE id_carrinho = $1
      AND id_produto = $2
      `,
      [id_carrinho, id_produto]
    );

    return result.rows[0];
  }

  static async adicionarItem(
    id_carrinho,
    id_produto,
    quantidade
  ) {

    return db.query(
      `
      INSERT INTO item_carrinho
      (id_carrinho,id_produto,quantidade)
      VALUES ($1,$2,$3)
      `,
      [id_carrinho, id_produto, quantidade]
    );
  }

  static async atualizarQuantidade(
    id_carrinho,
    id_produto,
    quantidade
  ) {

    return db.query(
      `
      UPDATE item_carrinho
      SET quantidade = quantidade + $1
      WHERE id_carrinho = $2
      AND id_produto = $3
      `,
      [quantidade, id_carrinho, id_produto]
    );
  }

  static async alterarQuantidade(
    id_item,
    quantidade
  ) {

    return db.query(
      `
      UPDATE item_carrinho
      SET quantidade = $1
      WHERE id_item = $2
      `,
      [quantidade, id_item]
    );
  }

  static async removerItem(id_item) {

    return db.query(
      `
      DELETE FROM item_carrinho
      WHERE id_item = $1
      `,
      [id_item]
    );
  }

  static async limparCarrinho(id_carrinho) {

    return db.query(
      `
      DELETE FROM item_carrinho
      WHERE id_carrinho = $1
      `,
      [id_carrinho]
    );
  }
}

module.exports = CarrinhoModel;