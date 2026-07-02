const crypto = require('crypto');
const pool = require('../config/database');

const hashSenha = (senha) => crypto.createHash('md5').update(senha).digest('hex');

exports.findByNick = async (nick) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, nick, senha FROM usuarios WHERE nick = ? LIMIT 1',
    [nick]
  );

  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, nick FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [id]
  );

  return rows[0];
};

exports.create = async ({ nome, nick, senha }) => {
  const senhaHash = hashSenha(senha);
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
    [nome, nick, senhaHash]
  );

  return exports.findById(result.insertId);
};

exports.hashSenha = hashSenha;
