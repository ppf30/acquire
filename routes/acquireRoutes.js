// routes/predictRoutes.js
const express = require("express");
const router = express.Router();

const acquireController = require("../controllers/acquireController");

// Contrato del servicio PREDICT
router.get("/health", acquireController.health);
router.post("/data", acquireController.data);

module.exports = router;