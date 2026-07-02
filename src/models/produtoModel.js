const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           p.categorias_id_categoria AS id_categoria,
           c.nome AS categoria
    FROM produtos p
    INNER JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
    ORDER BY p.id_produto
  `);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           p.categorias_id_categoria AS id_categoria,
           c.nome AS categoria
    FROM produtos p
    INNER JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
    WHERE p.id_produto = ?
  `, [id]);
  return rows[0];
};

exports.create = async ({ nome, valor, estoque, id_categoria }) => {
  const [result] = await pool.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque, id_categoria]
  );
  return exports.findById(result.insertId);
};

exports.update = async (id, { nome, valor, estoque, id_categoria }) => {
  const [result] = await pool.execute(
    'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
    [nome, valor, estoque, id_categoria, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
    [id]
  );
  return result.affectedRows;
};
