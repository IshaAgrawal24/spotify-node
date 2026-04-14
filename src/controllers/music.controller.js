const jwt = require("jsonwebtoken");
const uploadFile = require("../services/storage.service");
const musicModel = require("../models/music.model");

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

    const musicURL = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: musicURL,
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
    console.log("Error::", error)
    return res.status(401).json("Unauthorized");
  }
}

module.exports = { createMusic };
