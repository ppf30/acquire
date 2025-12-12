const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI no está definido");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB || "acquire_db"
    });

    console.log("✅ MongoDB connected:", mongoUri);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
