const express = require("express");
const acquireRoutes = require("./routes/acquireRoutes");
const connectDB = require("./model/database");

const app = express();

// Conectar a MongoDB antes de levantar el servicio
connectDB();

app.use(express.json());

// Rutas del servicio acquire
app.use("/", acquireRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Acquire service running on port ${PORT}`);
});
