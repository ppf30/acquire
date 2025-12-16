// server.js
require("dotenv").config();

const express = require("express");
const app = express();
const acquireRoutes = require("./routes/acquireRoutes");
const connectDB = require("./data/connectDB");

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Función de arranque
const startServer = async () => {
  try {
    // 1. Conectar a MongoDB (bloqueante)
    await connectDB();
    console.log("MongoDB conectado (ACQUIRE)");

    // 2. Registrar rutas SOLO después de conectar
    app.use("/", acquireRoutes);

    // 3. Levantar servidor
    app.listen(PORT, () => {
      console.log(`ACQUIRE escuchando en http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Fallo crítico al iniciar el servidor:", err);
    process.exit(1);
  }
};

startServer();
