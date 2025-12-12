// controllers/acquireController.js
const { fetchKunna } = require("../services/kunnaService");

// health endpoint
function health(req, res) {
  res.json({
    status: "ok",
    service: "acquire"
  });
}


// data endpoint
async function data(req, res) {
  try {
    const { timeStart, timeEnd } = req.query;

    const start = timeStart ? new Date(timeStart) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end   = timeEnd   ? new Date(timeEnd)   : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "INVALID_DATE_FORMAT" });
    }

    // Llama al servicio (que llama a Kunna)
    const result = await fetchKunna(start, end); // aquí se conecta a Kunna

    return res.json({
      status: "ok",
      from: start.toISOString(),
      to: end.toISOString(),
      data: result  // { columns, values }
    });

  } catch (err) {
    console.error("DATA_ENDPOINT_ERROR:", err);
    return res.status(500).json({
      error: "DATA_FETCH_ERROR",
      detail: err.message
    });
  }
}

module.exports = {
  health,
  data
};