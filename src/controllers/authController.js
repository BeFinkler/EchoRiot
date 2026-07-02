const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

exports.register = async (req, res) => {
  try {
    const { nome, nick, senha } = req.body;

    if (!nome || !nick || !senha) {
      return res.status(400).json({ msg: 'Nome, nick e senha sao obrigatorios' });
    }

    const usuarioExistente = await usuarioModel.findByNick(nick);
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Usuario ja existe' });
    }

    const usuario = await usuarioModel.create({ nome, nick, senha });
    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const nick = req.body.nick || req.body.email;
    const senha = req.body.senha || req.body.password;

    if (!nick || !senha) {
      return res.status(400).json({ msg: 'Nick e senha sao obrigatorios' });
    }

    const usuario = await usuarioModel.findByNick(nick);
    if (!usuario || usuario.senha !== usuarioModel.hashSenha(senha)) {
      return res.status(401).json({ msg: 'Credenciais invalidas' });
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      nick: usuario.nick,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        nick: usuario.nick,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
