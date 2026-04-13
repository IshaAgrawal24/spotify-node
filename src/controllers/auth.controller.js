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
        role
    },
  });
}

module.exports = {registerUser};
