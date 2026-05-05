const Playlist = require('../models/Playlist');

exports.create = async (req, res) => {
  const playlist = await Playlist.create({
    ...req.body,
    owner: req.user.id
  });
  res.json(playlist);
};

exports.getAll = async (req, res) => {
  const playlists = await Playlist.find();
  res.json(playlists);
};

exports.addSong = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  playlist.songs.push(req.body);

  await playlist.save();

  res.json(playlist);
};

exports.like = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist.likes.includes(req.user.id)) {
    playlist.likes.push(req.user.id);
  }

  await playlist.save();

  res.json(playlist);
};