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
    const playlists = await Playlist.find();
    res.json(playlists);
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