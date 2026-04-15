const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status_code: 401,
      return_message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (decoded.role != "artist") {
      return res.status(403).json({
        status_code: 401,
        return_message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    console.log("AuthArtist Middleware Error", error);
    return res.status(401).json({
      status_code: 401,
      return_message: "Unauthorized",
    });
  }
}

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status_code: 401,
      return_message: "Unauthorized",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role != "user" && decoded.role != "artist") {
      return res.status(403).json({
        status_code: 401,
        return_message: "Unauthorized",
      });
    }

    next();
  } catch (err) {
    console.log("AuthUser Middleware Error", error);
    return res.status(401).json({
      status_code: 401,
      return_message: "Unauthorized",
    });
  }
}

module.exports = { authArtist, authUser };
