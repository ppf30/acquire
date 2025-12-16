// controllers/acquireController.js
const { fetchKunna } = require("../services/kunnaService");

// Importamos Mongoose para guardar los datos
const AcquiredData = require("../data/acquireData"); 

// Constantes
const FEATURE_COUNT = 7;
const SCALER_VERSION = "v1";

// health endpoint
function health(req, res) {
  res.json({
    status: "ok",
    service: "acquire"
  });
}


function generateFeatures(kunnaResult) {
    const { values, columns } = kunnaResult;
    
    // 1. Identificar índices (asumiendo que Kunna siempre devuelve el mismo orden)
    const valueIndex = columns.indexOf("value");
    const timeIndex = columns.indexOf("time");

    if (values.length < 3) {
        throw new Error("FEATURE_GENERATION_FAILED: Se requieren al menos 3 puntos de consumo (lags).");
    }
    if (valueIndex === -1 || timeIndex === -1) {
        throw new Error("FEATURE_GENERATION_FAILED: Columnas 'value' o 'time' no encontradas.");
    }

    // 2. Extraer consumo (consumo_t, t-1, t-2)
    const consumo_t = values[0][valueIndex];
    const consumo_t_minus_1 = values[1][valueIndex];
    const consumo_t_minus_2 = values[2][valueIndex];
    
    // 3. Extraer features de tiempo del dato más reciente
    const latestTime = new Date(values[0][timeIndex]);

    // Usamos métodos UTC para consistencia. Date.getDay() 0=Domingo, 6=Sábado
    const hora = latestTime.getUTCHours(); 
    const dia_semana = latestTime.getUTCDay(); 
    const mes = latestTime.getUTCMonth() + 1; // getMonth() es 0-indexado
    const dia_mes = latestTime.getUTCDate();
    
    // 4. Construir el vector final
    const features = [
        consumo_t, 
        consumo_t_minus_1, 
        consumo_t_minus_2, 
        hora, 
        dia_semana, 
        mes, 
        dia_mes
    ];

    if (features.length !== FEATURE_COUNT || features.some(f => typeof f !== 'number')) {
        throw new Error("FEATURE_GENERATION_FAILED: El vector final es inválido.");
    }

    return features;
}
/*
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
*/

// data endpoint (CORREGIDO para cumplir con el contrato)
async function data(req, res) {
try {
    // 1. Obtener rango de tiempo y llamar a Kunna (MVP sin parámetros)
    const TRES_DIAS = 3 * 24 * 60 * 60 * 1000;
    const timeEnd = new Date();
    const timeStart = new Date(timeEnd.getTime() - TRES_DIAS);
    
    // Llama al servicio (que llama a Kunna)
    const kunnaResult = await fetchKunna(timeStart, timeEnd); 

    // 2. Generar Features
    const features = generateFeatures(kunnaResult);

    // 3. Guardar en MongoDB y obtener ID
    const newRecord = new AcquiredData({
        features: features,
        rawData: kunnaResult, // Opcional: guardar los datos brutos
        // Las demás propiedades (featureCount, scalerVersion, createdAt) 
        // se pueden dejar a los defaults del Schema o definirlas aquí.
        scalerVersion: SCALER_VERSION,
        featureCount: FEATURE_COUNT,
    });

    // Simulación de guardado. Reemplazar con la lógica real de Mongoose.
    await newRecord.save();
    const dataId = newRecord._id; // Mongoose genera el ID automáticamente

    // 4. Respuesta 201 (Created)
    return res.status(201).json({
        dataId: dataId.toString(),
        features: features,
        featureCount: FEATURE_COUNT,
        scalerVersion: SCALER_VERSION,
        createdAt: newRecord.createdAt.toISOString()
    });

   } catch (err) {
     console.error("DATA_ENDPOINT_ERROR:", err);

    // Mapeo de errores según la especificación (nice to have)
    let statusCode = 500;
    if (err.message.includes("KUNNA_BAD_STATUS")) {
        statusCode = 502; // Bad Gateway (API externa falló)
    } else if (err.message.includes("TIMEOUT")) {
        statusCode = 504; // Gateway Timeout
    }
    
     return res.status(statusCode).json({
      error: "ACQUIRE_PROCESS_ERROR",
      message: "Error al procesar, transformar o guardar los datos.",
      detail: err.message
    });
  }
}

module.exports = {
  health,
  data
};