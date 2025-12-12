// server.js
// Entry point del servicio ACQUIRE
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const acquireRoutes = require("./routes/acquireRoutes");
const PORT = process.env.PORT || 3001;


app.use(express.json());

// Conectamos a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado (ACQUIRE)"))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });

app.use("/", acquireRoutes);

app.listen(PORT, () => {
  console.log("ACQUIRE escuchando en http://localhost:${PORT}");
});
