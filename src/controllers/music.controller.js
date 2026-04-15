const jwt = require("jsonwebtoken");
const uploadFile = require("../services/storage.service");
const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      return_status: 401,
      message: "User is unauthorised.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({
        status_code: 403,
        return_message: "You don't have an access to create music.",
      });
    }

    const { title } = req.body;
    const file = req.file;

    const musicFile = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: musicFile.url,
      title: title,
      artist: decoded.id,
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
  } catch (error) {
    console.log("Error::", error);
    return res.status(401).json("Unauthorized");
  }
}

async function createAlbum(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role != "artist") {
      return res.status(403).json({ message: "Sorry, YOu do not have as access to create an album." });
    }

    const {title, musics} = req.body;

    const album = await albumModel.create({
      title: title,
      musics: musics,
      artist: decoded.id
    })

    res.status(201).json({
      status_code: 201,
      return_message: "Alnbum created successfully.",
      album: album
    })

  } catch (error) {
    console.log("Album Error:", error);
    return res.status(401).json({ message: "unauthorized" });
  }
}

module.exports = { createMusic, createAlbum };
