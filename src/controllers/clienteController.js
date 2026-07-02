const clienteModel = require('../models/clienteModel');

const statusValidos = ['bom', 'medio', 'ruim'];

const validarCliente = ({ nome, telefone, status }) => {
  if (!nome || !telefone) return 'Nome e telefone sao obrigatorios';
  if (status && !statusValidos.includes(status)) return 'Status deve ser bom, medio ou ruim';
  return null;
};

exports.listar = async (req, res) => {
  try {
    const clientes = await clienteModel.findAll();
    return res.json(clientes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await clienteModel.findById(req.params.id);
    if (!cliente) return res.status(404).json({ msg: 'Cliente nao encontrado' });
    return res.json(cliente);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const erro = validarCliente(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const cliente = await clienteModel.create(req.body);
    return res.status(201).json(cliente);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const erro = validarCliente(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const dados = { ...req.body, status: req.body.status || 'medio' };
    const alterado = await clienteModel.update(req.params.id, dados);
    if (!alterado) return res.status(404).json({ msg: 'Cliente nao encontrado' });

    const cliente = await clienteModel.findById(req.params.id);
    return res.json(cliente);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await clienteModel.remove(req.params.id);
    if (!removido) return res.status(404).json({ msg: 'Cliente nao encontrado' });
    return res.json({ msg: 'Cliente removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
