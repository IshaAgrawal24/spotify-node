const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("../models/user.model.js");

async function registerUser(req, res) {
  const { userName, email, password, role = "user" } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { userName }],
  });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      status_code: 409,
      return_message: "User is already exist.",
    });
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    role,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    status_code: 201,
    return_message: "User created successfully.",
    user: {
      id: user._id,
      userName,
      email,
      role,
    },
  });
}

async function loginUser(req, res) {
  const { userName, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      status_code: 401,
      return_message: "Invalid credentials",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      status_code: 401,
      return_message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);
  res.status(200).json({
    status_code: 200,
    return_message: "User loggeg in successfully.",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    status_code: 200,
    return_message: "User logged out successfully."
  })
}

module.exports = { registerUser, loginUser, logout };
