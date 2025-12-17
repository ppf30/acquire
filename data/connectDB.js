// data/connectDB.js
const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no está definida");
  }

  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/prediction");
  console.log("MongoDB conectado correctamente");
};

module.exports = connectDB;
