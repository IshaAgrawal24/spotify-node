const jwt = require("jsonwebtoken");
const uploadFile = require("../services/storage.service");
const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  const musicFile = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: musicFile.url,
    title: title,
    artist: req.user.id,
  });

  res.status(201).json({
    status_code: 201,
    return_message: "New Music is created successfully.",
    music: {
      id: music._id,
      title: music.title,
      file: music.uri,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title: title,
    musics: musics,
    artist: req.user.id,
  });

  res.status(201).json({
    status_code: 201,
    return_message: "Album created successfully.",
    album: album,
  });
}

async function getAllMusics(req, res) {
  const musicList = await musicModel
    .find()
    .skip(1)   //Skip the data
    .limit(2) // max limit to show data at a time
    .populate("artist", "userName email");

  res.status(200).json({
    status_code: 200,
    return_message: "Data fetched successfully.",
    music: musicList,
  });
}

async function getAllAlbums(req, res) {
  const albumList = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "userName email");

  res.status(200).json({
    status_code: 200,
    return_message: "Data fetched successfully.",
    album: albumList,
  });
}

async function getMusicByAlbumId(req, res) {
  const id = req.params.albumId;

  const list = await albumModel
    .findById(id)
    .populate("artist", "userName email")
    .populate("musics");

  res.status(200).json({
    status_code: 200,
    return_message: "Data fetched successfully.",
    music_list: list,
  });
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getMusicByAlbumId,
};
