const KUNNA_URL = "https://openapi.kunna.es/data/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjM2NDEwNjB9.ixb4O5Jgk-e_oPMSsycpD7A_iGVqIl4Ijl2a_kLrT94";

// alias fijo del contador
const ALIAS = "6339651";

/**
 * Llama a Kunna con un rango [timeStart, timeEnd]
 * y devuelve el objeto { columns, values }.
 */
async function fetchKunna(timeStart, timeEnd) {
  const url = KUNNA_URL;

  const headers = {
    "Content-Type": "application/json"
  };

  const body = {
    time_start: timeStart.toISOString(),
    time_end: timeEnd.toISOString(),
    filters: [
      { filter: "name", values: ["1d"] },
      { filter: "alias", values: [ALIAS] }
    ],
    limit: 100,
    count: false,
    order: "DESC"
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`KUNNA_BAD_STATUS: ${response.status}`);
  }

  const json = await response.json();

  if (!json.result || 
      !Array.isArray(json.result.columns) || 
      !Array.isArray(json.result.values)) {
    throw new Error("KUNNA_INVALID_RESULT");
  }

  return json.result; // { columns, values }
}

module.exports = { fetchKunna };
