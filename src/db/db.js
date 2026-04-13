const mongoose = require("mongoose");

const MONGO_URI = process.env.CONN_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB.");
  } catch (error) {
    console.log("Error to connect DB", error);
  }
}

module.exports = connectDB;
