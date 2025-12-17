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
    await connectDB();
    console.log("MongoDB conectado (ACQUIRE)");
    
    app.use("/", acquireRoutes);

   
    app.listen(PORT, () => {
      console.log(`ACQUIRE escuchando en http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Fallo crítico al iniciar el servidor:", err);
    process.exit(1);
  }
};

startServer();
