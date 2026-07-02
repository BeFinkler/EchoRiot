const pedidoModel = require('../models/pedidoModel');

const validarPedido = ({ data, id_cliente, itens }) => {
  if (!data || !id_cliente) return 'Data e id_cliente sao obrigatorios';
  if (!Array.isArray(itens) || itens.length === 0) return 'Informe ao menos um item no pedido';

  const itemInvalido = itens.some((item) => (
    !item.id_produto || item.quantidade === undefined || item.valor === undefined
  ));

  if (itemInvalido) {
    return 'Cada item precisa ter id_produto, quantidade e valor';
  }

  return null;
};

exports.listar = async (req, res) => {
  try {
    const pedidos = await pedidoModel.findAll();
    return res.json(pedidos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const pedido = await pedidoModel.findById(req.params.id);
    if (!pedido) return res.status(404).json({ msg: 'Pedido nao encontrado' });
    return res.json(pedido);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const erro = validarPedido(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const pedido = await pedidoModel.create(req.body);
    return res.status(201).json(pedido);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const erro = validarPedido(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const alterado = await pedidoModel.update(req.params.id, req.body);
    if (!alterado) return res.status(404).json({ msg: 'Pedido nao encontrado' });

    const pedido = await pedidoModel.findById(req.params.id);
    return res.json(pedido);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await pedidoModel.remove(req.params.id);
    if (!removido) return res.status(404).json({ msg: 'Pedido nao encontrado' });
    return res.json({ msg: 'Pedido removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
