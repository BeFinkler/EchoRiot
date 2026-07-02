const categoriaModel = require('../models/categoriaModel');

exports.listar = async (req, res) => {
  try {
    const categorias = await categoriaModel.findAll();
    return res.json(categorias);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const categoria = await categoriaModel.findById(req.params.id);
    if (!categoria) return res.status(404).json({ msg: 'Categoria nao encontrada' });
    return res.json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ msg: 'Nome e obrigatorio' });

    const categoria = await categoriaModel.create({ nome });
    return res.status(201).json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ msg: 'Nome e obrigatorio' });

    const alterado = await categoriaModel.update(req.params.id, { nome });
    if (!alterado) return res.status(404).json({ msg: 'Categoria nao encontrada' });

    const categoria = await categoriaModel.findById(req.params.id);
    return res.json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await categoriaModel.remove(req.params.id);
    if (!removido) return res.status(404).json({ msg: 'Categoria nao encontrada' });
    return res.json({ msg: 'Categoria removida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
