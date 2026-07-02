const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias ORDER BY id_categoria'
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return rows[0];
};

exports.create = async ({ nome }) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  );
  return exports.findById(result.insertId);
};

exports.update = async (id, { nome }) => {
  const [result] = await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return result.affectedRows;
};
