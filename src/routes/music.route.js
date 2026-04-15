const express = require("express");
const multer = require("multer");

const musicController = require("../controllers/music.controller");
const authMiddleWare = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Create Music POST API 
router.post(
  "/upload-music",
  authMiddleWare.authArtist,
  upload.single("music"),
  musicController.createMusic,
);

// Create Album POST API 
router.post(
  "/upload-album",
  authMiddleWare.authArtist,
  musicController.createAlbum,
);

module.exports = router;
