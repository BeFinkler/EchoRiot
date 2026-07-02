const pool = require('../config/database');

const montarPedido = async (id) => {
  const [pedidos] = await pool.execute(`
    SELECT p.id_pedido, p.data, p.clientes_id_cliente AS id_cliente, c.nome AS cliente
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
    WHERE p.id_pedido = ?
  `, [id]);

  if (!pedidos[0]) return null;

  const [itens] = await pool.execute(`
    SELECT pp.produtos_id_produto AS id_produto, pr.nome AS produto,
           pp.quantidade, pp.valor
    FROM produtos_pedidos pp
    INNER JOIN produtos pr ON pr.id_produto = pp.produtos_id_produto
    WHERE pp.pedidos_id_pedido = ?
  `, [id]);

  return { ...pedidos[0], itens };
};

exports.findAll = async () => {
  const [rows] = await pool.execute(`
    SELECT p.id_pedido, p.data, p.clientes_id_cliente AS id_cliente, c.nome AS cliente
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
    ORDER BY p.id_pedido
  `);
  return rows;
};

exports.findById = montarPedido;

exports.create = async ({ data, id_cliente, itens }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedidoResult] = await connection.execute(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data, id_cliente]
    );

    const idPedido = pedidoResult.insertId;

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
        [item.id_produto, idPedido, item.quantidade, item.valor]
      );
    }

    await connection.commit();
    return montarPedido(idPedido);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.update = async (id, { data, id_cliente, itens }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedidoResult] = await connection.execute(
      'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?',
      [data, id_cliente, id]
    );

    if (!pedidoResult.affectedRows) {
      await connection.rollback();
      return 0;
    }

    await connection.execute(
      'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
      [id]
    );

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
        [item.id_produto, id, item.quantidade, item.valor]
      );
    }

    await connection.commit();
    return 1;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.remove = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?', [id]);
    const [result] = await connection.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    await connection.commit();
    return result.affectedRows;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
