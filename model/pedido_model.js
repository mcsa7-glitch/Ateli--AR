const db = require("../db");

class PedidoModel {

  static async criarPedido(dados) {

    const result = await db.query(
      `
      INSERT INTO pedidos
      (
        codigo_pedido,
        id_usuario,
        total,
        status,
        nome,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        complemento
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        dados.codigo_pedido,
        dados.id_usuario,
        dados.total,
        dados.status,
        dados.nome,
        dados.cpf,
        dados.cep,
        dados.rua,
        dados.numero,
        dados.bairro,
        dados.complemento
      ]
    );

    return result.rows[0];
  }

  static async salvarItem(
    id_pedido,
    id_produto,
    quantidade,
    preco_unitario
  ) {

    await db.query(
      `
      INSERT INTO item_pedido
      (id_pedido,id_produto,quantidade,preco_unitario)
      VALUES ($1,$2,$3,$4)
      `,
      [
        id_pedido,
        id_produto,
        quantidade,
        preco_unitario
      ]
    );
  }

  static async atualizarPagamento(
    id_pedido,
    pagamento_id
  ) {

    await db.query(
      `
      UPDATE pedidos
      SET pagamento_id=$1
      WHERE id_pedido=$2
      `,
      [pagamento_id, id_pedido]
    );
  }

  static async atualizarStatus(
    status,
    pagamento_id
  ) {

    await db.query(
      `
      UPDATE pedidos
      SET status=$1
      WHERE pagamento_id=$2
      `,
      [status, pagamento_id]
    );
  }

  static async buscarPedido(id) {

    const result = await db.query(
      `
      SELECT *
      FROM pedidos
      WHERE id_pedido=$1
      `,
      [id]
    );

    return result.rows[0];
  }

  static async buscarItens(id) {

    const result = await db.query(
      `
      SELECT
        ip.*,
        p.nome
      FROM item_pedido ip
      JOIN produtos p
      ON p.id = ip.id_produto
      WHERE ip.id_pedido = $1
      `,
      [id]
    );

    return result.rows;
  }

  static async listarPorUsuario(
    id_usuario
  ) {

    const result = await db.query(
      `
      SELECT *
      FROM pedidos
      WHERE id_usuario=$1
      `,
      [id_usuario]
    );

    return result.rows;
  }
}

module.exports = PedidoModel;