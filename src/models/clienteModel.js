const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes ORDER BY id_cliente'
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return rows[0];
};

exports.create = async ({ nome, telefone, status }) => {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status || 'medio']
  );
  return exports.findById(result.insertId);
};

exports.update = async (id, { nome, telefone, status }) => {
  const [result] = await pool.execute(
    'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
    [nome, telefone, status, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return result.affectedRows;
};
