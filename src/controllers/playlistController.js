const Playlist = require('../models/Playlist');

exports.create = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      ...req.body,
      owner: req.user.id
    });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    let query = { owner: req.user.id };

    // Sistema de busca
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const playlists = await Playlist.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .populate('owner', 'name');

    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist não encontrada' });
    }

    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Você não tem permissão para editar esta playlist' });
    }

    const { name, description } = req.body;
    playlist.name = name || playlist.name;
    playlist.description = description !== undefined ? description : playlist.description;

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userPlaylists = await Playlist.find({ owner: req.user.id });

    const stats = {
      totalPlaylists: userPlaylists.length,
      totalSongs: userPlaylists.reduce((sum, p) => sum + p.songs.length, 0),
      recentPlaylists: userPlaylists.filter(p =>
        new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSong = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist não encontrada' });
    }

    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Você não tem permissão para adicionar músicas a esta playlist' });
    }

    playlist.songs.push(req.body);
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.like = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist não encontrada' });
    }

    if (!playlist.likes.includes(req.user.id)) {
      playlist.likes.push(req.user.id);
    }

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist não encontrada' });
    }

    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Você não tem permissão para remover músicas desta playlist' });
    }

    const songIndex = req.params.songIndex;
    if (songIndex < 0 || songIndex >= playlist.songs.length) {
      return res.status(400).json({ msg: 'Índice da música inválido' });
    }

    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist não encontrada' });
    }

    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Você não tem permissão para deletar esta playlist' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Playlist deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};