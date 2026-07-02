const produtoModel = require('../models/produtoModel');

const validarProduto = ({ nome, valor, estoque, id_categoria }) => {
  if (!nome || valor === undefined || estoque === undefined || !id_categoria) {
    return 'Nome, valor, estoque e id_categoria sao obrigatorios';
  }
  return null;
};

exports.listar = async (req, res) => {
  try {
    const produtos = await produtoModel.findAll();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await produtoModel.findById(req.params.id);
    if (!produto) return res.status(404).json({ msg: 'Produto nao encontrado' });
    return res.json(produto);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const erro = validarProduto(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const produto = await produtoModel.create(req.body);
    return res.status(201).json(produto);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const erro = validarProduto(req.body);
    if (erro) return res.status(400).json({ msg: erro });

    const alterado = await produtoModel.update(req.params.id, req.body);
    if (!alterado) return res.status(404).json({ msg: 'Produto nao encontrado' });

    const produto = await produtoModel.findById(req.params.id);
    return res.json(produto);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await produtoModel.remove(req.params.id);
    if (!removido) return res.status(404).json({ msg: 'Produto nao encontrado' });
    return res.json({ msg: 'Produto removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
